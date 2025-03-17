import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function UserTripCard({ trip }) {
  const [showMoveButton, setShowMoveButton] = useState(false);
  const [photoId, setPhotoId] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

  // Safely parse JSON data with error handling
  const formatData = (data) => {
    try {
      if (!data) return {};
      const parsedData = JSON.parse(data);
      return parsedData || {};
    } catch (err) {
      console.error("Error parsing trip data:", err);
      return {};
    }
  };

  // Get trip data with safeguards
  const tripData = formatData(trip?.tripData);

  const handleLongPress = () => {
    setShowMoveButton(true);
  };

  const handlePressOutside = () => {
    setShowMoveButton(false);
  };

  const navigateToTripDetails = () => {
    // First, let's deeply analyze the structure to understand what we're working with
    console.log(
      "Navigating with trip data structure:",
      JSON.stringify(tripData, null, 2)
    );

    // Create a normalized version of the trip data that includes all required properties
    // with proper defaults based on your Firebase structure
    const normalizedTripData = {
      ...tripData,
      // Ensure these top-level properties exist
      location: tripData.location || {
        name: tripData.tripPlan?.travelPlan?.destination || "Unknown Location",
      },
      traveler: tripData.traveler || {
        title: tripData.tripPlan?.travelers || "Unknown",
      },
      startDate: tripData.startDate || new Date().toISOString(),
      endDate: tripData.endDate || new Date().toISOString(),
      budget:
        tripData.budget || tripData.tripPlan?.travelPlan?.budget || "Standard",
      totalNoOfDays:
        tripData.totalNoOfDays ||
        (tripData.tripPlan?.travelPlan?.duration
          ? parseInt(tripData.tripPlan.travelPlan.duration)
          : 1),

      // Create a normalized flight object based on the nested structure
      // This will be used by the FlightInfo component
      flight: {
        price:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.price ||
          "Price not available",
        airline:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.airline ||
          "Airline not specified",
        flightNumber:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.flightNumber ||
          "Flight number not specified",
        departureTime:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.departureTime ||
          "Departure time not specified",
        arrivalTime:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.arrivalTime ||
          "Arrival time not specified",
        duration:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.duration ||
          "Duration not specified",
        details:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.details ||
          "Flight details not available",
        bookingUrl:
          tripData.tripPlan?.travelPlan?.flights?.[0]?.bookingUrl ||
          "Booking URL not available",
      },

      // Ensure other potentially required properties exist
      hotel:
        tripData.hotel ||
        (tripData.tripPlan?.travelPlan?.hotels?.[0]
          ? {
              name:
                tripData.tripPlan.travelPlan.hotels[0].hotelName ||
                "Hotel name not available",
              address:
                tripData.tripPlan.travelPlan.hotels[0].address ||
                "Address not available",
              price:
                tripData.tripPlan.travelPlan.hotels[0].price ||
                "Price not available",
              rating: tripData.tripPlan.travelPlan.hotels[0].rating || 0,
              description:
                tripData.tripPlan.travelPlan.hotels[0].description ||
                "No description available",
            }
          : {}),

      // Make sure itinerary data is available
      itinerary:
        tripData.itinerary || tripData.tripPlan?.travelPlan?.itinerary || {},

      // Preserve any other original properties
      tripPlan: tripData.tripPlan || {},
    };

    // Log the normalized structure to help debug any issues
    console.log(
      "Normalized trip data:",
      JSON.stringify(normalizedTripData, null, 2)
    );

    // Create the updated trip object
    const safeTrip = {
      ...trip,
      tripData: JSON.stringify(normalizedTripData),
    };

    // Navigate with the normalized data
    router.push({
      pathname: "/trip-details",
      params: { trip: JSON.stringify(safeTrip) },
    });
  };

  useEffect(() => {
    const fetchPhotoReference = async (placeId) => {
      try {
        if (!placeId) {
          console.log("No place ID provided");
          setPhotoId("https://via.placeholder.com/400");
          return;
        }

        console.log("Fetching photo for Place ID:", placeId);

        // Step 1: Fetch Photo Reference from Google Places API
        const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=photos&key=${apiKey}`;
        const response = await fetch(detailsUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          const photoReference = data.photos[0].name;

          // Step 2: Get the actual photo using the reference
          const photoUrl = `https://places.googleapis.com/v1/${photoReference}/media?key=${apiKey}&maxWidthPx=400`;
          setPhotoId(photoUrl);
        } else {
          console.log("No photos available for this place");
          setPhotoId("https://via.placeholder.com/400");
        }
      } catch (err) {
        console.error("Error fetching photo:", err);
        setPhotoId("https://via.placeholder.com/400");
        setError("Failed to load photo");
      }
    };

    // Ensure we have a place ID before trying to fetch
    const locationPlaceId = tripData.locationPlaceId;
    if (locationPlaceId) {
      fetchPhotoReference(locationPlaceId);
    } else {
      setPhotoId("https://via.placeholder.com/400");
    }
  }, [trip?.tripData, apiKey]);

  // Get location name based on the complex structure
  const getLocationName = () => {
    // Try different paths based on the data structure variations
    return (
      tripData.location?.name ||
      tripData.tripPlan?.travelPlan?.destination ||
      "Unknown Location"
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      onPress={navigateToTripDetails}
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: photoId || "https://via.placeholder.com/400",
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
        }}
      />
      <View>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 18,
          }}
        >
          {getLocationName()}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: Colors.GRAY,
          }}
        >
          {tripData.startDate
            ? moment(tripData.startDate).format("DD MMM yyyy")
            : "Date not specified"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: Colors.GRAY,
          }}
        >
          Traveling:{" "}
          {tripData.traveler?.title ||
            tripData.tripPlan?.travelers ||
            "Unknown"}
        </Text>
      </View>
      {showMoveButton && (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 10,
            borderRadius: 5,
            marginLeft: "auto",
            marginTop: "auto",
          }}
          onPress={() =>
            Alert.alert(
              "Move to Home Screen",
              "This button will move the trip to the home screen."
            )
          }
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: "outfit-medium",
              fontSize: 14,
            }}
          >
            Move to Home
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
