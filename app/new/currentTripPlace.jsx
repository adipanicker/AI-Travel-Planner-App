import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { auth } from "../../configs/FirebaseConfig";

export default function CurrentTripPlace() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch autocomplete suggestions using the new API
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          },
          body: JSON.stringify({
            input: input,
            // Optional: Add location bias if you want to prioritize results near a location
            // locationBias: {
            //   circle: {
            //     center: {
            //       latitude: 37.7937,
            //       longitude: -122.3965
            //     },
            //     radius: 5000.0
            //   }
            // }
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", JSON.stringify(data));

      // Check if the response has the expected format
      if (!data || !data.suggestions) {
        console.error("Unexpected API response format:", data);
        setError("Invalid response from Places API");
        setSuggestions([]);
        return;
      }

      // Extract only place predictions (no query predictions)
      const placePredictions = data.suggestions
        .filter((suggestion) => suggestion.placePrediction)
        .map((suggestion) => ({
          placeId: suggestion.placePrediction.placeId,
          description: suggestion.placePrediction.text.text,
          place: suggestion.placePrediction.place,
        }));

      setSuggestions(placePredictions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch place details
  const fetchPlaceDetails = async (placeId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/${placeId}`,
        {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
            "X-Goog-FieldMask": "displayName,formattedAddress,location,photos",
          },
        }
      );

      const details = await response.json();

      console.log("Place Details Response:", JSON.stringify(details));

      // Check if the response has the expected format
      if (!details) {
        console.error("Unexpected place details response:", details);
        setError("Invalid response from Places API");
        return;
      }

      // Extract the required information
      const photoRef =
        details.photos && details.photos.length > 0
          ? details.photos[0].name
          : null;

      const imageUrl = photoRef
        ? `https://places.googleapis.com/v1/${photoRef}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}&maxHeightPx=400&maxWidthPx=400`
        : null;

      setPlaceDetails({
        name:
          details.displayName || details.formattedAddress || "Unnamed Location",
        location: details.location
          ? { lat: details.location.latitude, lng: details.location.longitude }
          : {},
        imageUrl: imageUrl,
      });

      setSearchQuery(
        (details.displayName && details.displayName.text) ||
          details.formattedAddress ||
          "Unnamed Location"
      );
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching place details:", error);
      setError("Failed to fetch place details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchSuggestions(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePlaceSubmit = async () => {
    if (placeDetails) {
      try {
        // Check if placeDetails.name is an object or string
        const tripName =
          typeof placeDetails.name === "object"
            ? placeDetails.name.text
            : placeDetails.name;

        const docRef = await addDoc(collection(db, "ManagedTrips"), {
          tripName: tripName, // Now this will always be a string
          location: placeDetails.location || {},
          imageUrl: placeDetails.imageUrl || null,
          userEmail: auth.currentUser?.email || "unknown",
          createdAt: new Date(),
        });

        console.log("Trip added with ID: ", docRef.id);
        router.push("/(tabs)/tripManager");
      } catch (error) {
        console.error("Error adding trip: ", error);
        setError("Failed to save trip. Please try again.");
      }
    } else {
      console.error("No place details available to submit.");
      setError("Please select a location before submitting.");
    }
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "outfit-bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Add place you're currently visiting or planning to visit
      </Text>

      <View style={{ position: "relative", zIndex: 1 }}>
        <TextInput
          placeholder="Search Place"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
            marginTop: 25,
          }}
        />

        {loading && (
          <ActivityIndicator
            style={{ position: "absolute", right: 15, top: 35 }}
            color={Colors.PRIMARY}
          />
        )}

        {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) =>
              item.placeId || `suggestion-${index}`
            }
            style={{
              position: "absolute",
              top: 70,
              left: 0,
              right: 0,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              maxHeight: 200,
              zIndex: 2,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
                onPress={() => {
                  fetchPlaceDetails(item.place);
                }}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {placeDetails && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Submit Trip"
            onPress={handlePlaceSubmit}
            color={Colors.PRIMARY}
          />
        </View>
      )}
    </View>
  );
}
