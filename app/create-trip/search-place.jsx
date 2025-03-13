import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { CreateTripContext } from "./../../context/CreateTripContext";
import { Colors } from "../../constants/Colors";

export default function SearchPlace() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const [selectedPlace, setSelectedPlace] = useState(null); // State to track selected place
  const [searchQuery, setSearchQuery] = useState(""); // User input
  const [predictions, setPredictions] = useState([]); // API response

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Select Destination",
    });
  }, []);

  const handleNextPress = () => {
    console.log("Selected Place:", selectedPlace);
    if (selectedPlace) {
      setTripData({ ...tripData, location: selectedPlace }); // Save the destination in the context
      router.push("/create-trip/select-traveler"); // Navigate to the next page
    }
  };

  // Fetch place predictions using the new Google Places API
  const fetchPredictions = async (query) => {
    if (!query) {
      setPredictions([]);
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

    const apiUrl = "https://places.googleapis.com/v1/places:autocomplete";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.text,suggestions.queryPrediction.text",
        },
        body: JSON.stringify({
          input: query,
          locationBias: {
            circle: {
              center: {
                latitude: 10.56, // Set appropriate lat/lon or fetch dynamically
                longitude: 76.4194,
              },
              radius: 5000.0, // Bias for nearby locations
            },
          },
          languageCode: "en",
          includeQueryPredictions: true, // Allow generic search queries
        }),
      });

      const data = await response.json();
      console.log("Autocomplete Response:", data.toString());

      if (data.suggestions) {
        const placeNames = data.suggestions.map((item) =>
          item.placePrediction
            ? item.placePrediction.text.text
            : item.queryPrediction
            ? item.queryPrediction.text.text
            : ""
        );
        setPredictions(placeNames.filter((name) => name));
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  // Fetch place details using the new Google Places API
  const fetchPlaceDetails = async (placeId) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

    const apiUrl = `https://places.googleapis.com/v1/places/${placeId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "displayName,formattedAddress,location,photos,websiteUri",
        },
      });

      const data = await response.json();
      console.log("Place Details Response:", data);

      return data;
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/source.jpg")} // Background image
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Title */}
        <Text style={styles.title}>Where do you want to go?</Text>

        {/* Custom Input Field */}
        <TextInput
          style={styles.textInput}
          placeholder="Search for a destination"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchPredictions(text);
          }}
        />

        {/* Display Predictions */}
        <FlatList
          data={predictions}
          keyExtractor={(item, index) => index.toString()}
          style={styles.listView}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={async () => {
                setSelectedPlace({ name: item });
                setSearchQuery(item);
                setPredictions([]);
              }}
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* NEXT Button */}
        {selectedPlace && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "outfit-bold",
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  listView: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listItemText: {
    fontSize: 16,
    color: "#000",
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
