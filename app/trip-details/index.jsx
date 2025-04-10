import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import moment from "moment";
import FlightInfo from "../../components/TripDetails/FlightInfo";
import HotelList from "../../components/TripDetails/HotelList";
import PlannedTrip from "../../components/TripDetails/PlannedTrip";

export default function TripDetails() {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState("Estimate Not Available");
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

  const formatData = (data) => {
    try {
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing trip data:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeTripDetails = () => {
      try {
        if (!trip) {
          throw new Error("No trip data provided");
        }

        const parsedTrip = JSON.parse(trip);
        setTripDetails(parsedTrip);

        // Extract estimated cost with error handling
        const cost =
          parsedTrip?.estimatedCostPerPerson ||
          parsedTrip?.tripPlan?.travelPlan?.estimatedCostPerPerson ||
          "Estimate Not Available";
        setEstimatedCost(cost);

        navigation.setOptions({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
        });
      } catch (error) {
        console.error("Error initializing trip details:", error);
        Alert.alert("Error", "Unable to load trip details. Please try again.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    };

    initializeTripDetails();
  }, [trip]);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      try {
        if (!tripDetails) return;

        const tripData =
          formatData(tripDetails?.tripData) || tripDetails?.tripData;
        const locationPlaceId =
          tripData?.location?.placeId ||
          tripData?.locationPlaceId ||
          tripData?.location?.locationPlaceId;

        if (!locationPlaceId) {
          console.log("No place ID found");
          return;
        }

        // Step 1: Fetch photo reference from Place Details
        const detailsUrl = `https://places.googleapis.com/v1/places/${locationPlaceId}?fields=photos&key=${apiKey}`;
        const response = await fetch(detailsUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          const photoReference = data.photos[0].name;

          // Step 2: Construct URL for photo using the new API format
          const newPhotoUrl = `https://places.googleapis.com/v1/${photoReference}/media?maxHeightPx=800&maxWidthPx=800&key=${apiKey}`;
          setPhotoUrl(newPhotoUrl);
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
        // Optional: Set a default placeholder image if photo fetch fails
        setPhotoUrl(
          "https://via.placeholder.com/800x330/cccccc/666666?text=No+Image"
        );
      }
    };

    fetchPhotoUrl();
  }, [tripDetails, apiKey]);

  // Render loading or error state if trip details are not available
  if (!tripDetails) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "outfit", fontSize: 18 }}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        source={{
          uri:
            photoUrl ||
            "https://via.placeholder.com/800x330/cccccc/666666?text=No+Image",
        }}
        style={{
          width: "100%",
          height: 330,
        }}
        onError={(e) => {
          console.log("Image loading error:", e.nativeEvent.error);
          // Fallback to placeholder if image fails to load
          setPhotoUrl(
            "https://via.placeholder.com/800x330/cccccc/666666?text=No+Image"
          );
        }}
      />
      <View
        style={{
          padding: 15,
          backgroundColor: Colors.WHITE,
          height: "100%",
          marginTop: -30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontFamily: "outfit-bold",
          }}
        >
          {tripDetails?.tripPlan?.travelPlan?.location
            ? tripDetails.tripPlan.travelPlan.location
            : tripDetails?.tripPlan?.travelPlan?.destination ||
              "Unknown Destination"}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
              color: Colors.GRAY,
            }}
          >
            {moment(
              formatData(tripDetails.tripData)?.startDate ||
                tripDetails.tripData.startDate
            ).format("DD MMM yyyy")}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
              color: Colors.GRAY,
            }}
          >
            {" "}
            {moment(
              formatData(tripDetails.tripData)?.endDate ||
                tripDetails.tripData.endDate
            ).format("DD MMM yyyy")}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color: Colors.GRAY,
          }}
        >
          🚌 {formatData(tripDetails.tripData)?.traveler?.title || "Travelers"}
        </Text>

        {/* Estimated Cost Per Person */}
        <View
          style={{
            backgroundColor: Colors.LIGHT_GRAY,
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 18,
              color: Colors.BLACK,
            }}
          >
            Estimated Cost Per Person
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color:
                estimatedCost === "Estimate Not Available"
                  ? Colors.RED
                  : Colors.GRAY,
            }}
          >
            {estimatedCost}
          </Text>
        </View>

        {/* Flight Info  */}
        <FlightInfo flightData={tripDetails?.tripPlan?.travelPlan?.flight} />
        {/* Hotels List  */}
        <HotelList hotelList={tripDetails?.tripPlan?.travelPlan?.hotels} />
        {/* Trip Day Planner Info */}
        <PlannedTrip details={tripDetails?.tripPlan?.travelPlan?.itinerary} />
      </View>
    </ScrollView>
  );
}
