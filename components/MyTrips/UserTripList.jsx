import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Colors } from "../../constants/Colors";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

export default function UserTripList({ userTrips }) {
  const router = useRouter();
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;
  const [photoId, setPhotoId] = useState("");

  // Handle empty trips case
  if (!userTrips || userTrips.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, color: Colors.GRAY }}>
          No trips found.
        </Text>
      </View>
    );
  }

  // Parse all trip data first to access the date properties
  const parsedTrips = userTrips.map((trip) => ({
    ...trip,
    parsedData: JSON.parse(trip.tripData),
  }));

  // We need to prioritize the most recently created trip
  // Since your list shows newest trips at the bottom, we'll use that to determine the "newest" trip
  // Assuming the last trip in userTrips array is the most recently added
  const newestAddedTrip = parsedTrips[parsedTrips.length - 1];

  // For cases where we need backup sorting by date
  const currentDate = new Date();

  // First, separate upcoming and past trips
  const upcomingTrips = parsedTrips.filter(
    (trip) => new Date(trip.parsedData.startDate) >= currentDate
  );

  const pastTrips = parsedTrips.filter(
    (trip) => new Date(trip.parsedData.startDate) < currentDate
  );

  // Sort upcoming trips by start date (ascending - soonest first)
  upcomingTrips.sort(
    (a, b) =>
      new Date(a.parsedData.startDate) - new Date(b.parsedData.startDate)
  );

  // Sort past trips by start date (descending - most recent first)
  pastTrips.sort(
    (a, b) =>
      new Date(b.parsedData.startDate) - new Date(a.parsedData.startDate)
  );

  // Always prioritize the newest added trip, regardless of its start date
  const latestTrip = newestAddedTrip;
  const latestTripData = latestTrip.parsedData;

  useEffect(() => {
    const fetchPhotoReference = async (placeId) => {
      try {
        if (!placeId) return;
        console.log("Fetching Place ID:", placeId);

        const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=photos&key=${apiKey}`;
        const response = await fetch(detailsUrl);
        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          const photoReference = data.photos[0].name;
          const photoUrl = `https://places.googleapis.com/v1/${photoReference}/media?key=${apiKey}&maxWidthPx=400`;
          setPhotoId(photoUrl);
        } else {
          console.log("No photos found, using default image.");
          setPhotoId("https://via.placeholder.com/400");
        }
      } catch (err) {
        console.log("Error fetching photo:", err);
        setPhotoId("https://via.placeholder.com/400");
      }
    };

    // Use the placeId from the latest trip
    fetchPhotoReference(latestTripData.locationPlaceId);
  }, [latestTripData.locationPlaceId, apiKey]);

  return (
    <View style={{ marginTop: 20 }}>
      {/* Latest Trip Banner */}
      <Image
        source={{
          uri: photoId || "https://via.placeholder.com/400",
        }}
        style={{
          width: "100%",
          height: 240,
          borderRadius: 15,
        }}
      />

      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 24,
          }}
        >
          {latestTripData.location?.name || "Unknown Location"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: Colors.GRAY,
            }}
          >
            {moment(latestTripData.startDate).format("DD MMM yyyy")}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: Colors.GRAY,
            }}
          >
            {latestTripData.traveler?.icon || "🚌"}{" "}
            {latestTripData.traveler?.title || "Unknown Traveler"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: {
                trip: JSON.stringify(latestTrip),
              },
            })
          }
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 15,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 15,
            }}
          >
            See your plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* List of All Trips */}
      {userTrips.map((trip, index) => (
        <UserTripCard trip={trip} key={index} />
      ))}
    </View>
  );
}
