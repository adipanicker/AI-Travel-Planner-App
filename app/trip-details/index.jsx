import { View, Text, Image, ScrollView } from "react-native";
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
  const [tripDetails, setTripDetails] = useState(JSON.parse(trip));
  const [photoUrl, setPhotoUrl] = useState(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

  const formatData = (data) => {
    return data && JSON.parse(data);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    trip && setTripDetails(JSON.parse(trip));
  }, [trip]);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      try {
        if (!tripDetails) return;

        const tripData = formatData(tripDetails?.tripData);
        const locationPlaceId =
          tripData?.location?.placeId || tripData?.locationPlaceId;

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
      }
    };

    fetchPhotoUrl();
  }, [tripDetails, apiKey]);

  return (
    tripDetails && (
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
              : tripDetails?.tripPlan?.travelPlan?.destination}
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
              {moment(formatData(tripDetails.tripData).startDate).format(
                "DD MMM yyyy"
              )}
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 18,
                color: Colors.GRAY,
              }}
            >
              {" "}
              {moment(formatData(tripDetails.tripData)?.endDate).format(
                "DD MMM yyyy"
              )}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: Colors.GRAY,
            }}
          >
            🚌 {formatData(tripDetails.tripData)?.traveler?.title}
          </Text>

          {/* Flight Info  */}
          <FlightInfo flightData={tripDetails?.tripPlan?.travelPlan?.flight} />
          {/* Hotels List  */}
          <HotelList hotelList={tripDetails?.tripPlan?.travelPlan?.hotels} />
          {/* Trip Day Planner Info */}
          <PlannedTrip details={tripDetails?.tripPlan?.travelPlan?.itinerary} />
        </View>
      </ScrollView>
    )
  );
}
