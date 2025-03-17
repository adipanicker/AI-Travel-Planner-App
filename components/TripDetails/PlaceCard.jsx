import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { GetPhotoRef } from "../../services/GooglePlaceApi";

export default function PlaceCard({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [loading, setLoading] = useState(true);

  const [photoRef, setPhotoRef] = useState();
  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    try {
      // Assuming GetPhotoRef returns a photo resource name from the new API
      const photoRef = await GetPhotoRef(place.placeName);

      if (photoRef) {
        // Format URL according to Places API V1
        const newPhotoUrl = `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
        setPhotoUrl(newPhotoUrl);
      } else {
        // Use a placeholder if no photo reference is returned
        setPhotoUrl(
          "https://via.placeholder.com/180x120/cccccc/666666?text=No+Image"
        );
      }
    } catch (error) {
      console.error("Error getting photo reference:", error);
      // Use a placeholder on error
      setPhotoUrl(
        "https://via.placeholder.com/180x120/cccccc/666666?text=Error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Colors.LIGHT_BLUE,
        padding: 10,
        borderRadius: 15,
        borderColor: Colors.GRAY,
        marginTop: 20,
      }}
    >
      <Image
        source={{ uri: photoUrl }}
        style={{
          width: "100%",
          height: 300,
          borderRadius: 15,
        }}
        defaultSource={require("../../assets/images/placeholder.jpeg")} // Add a local placeholder image
      />
      <View
        style={{
          marginTop: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          {place?.placeName}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: Colors.GRAY,
          }}
        >
          {place.placeDetails}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                marginTop: 5,
              }}
            >
              🎟️ Ticket Price:
              <Text
                style={{
                  fontFamily: "outfit-bold",
                }}
              >
                {" "}
                {place?.ticketPricing}
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                marginTop: 5,
              }}
            >
              ⏱️ Time to Travel:{" "}
              <Text
                style={{
                  fontFamily: "outfit-bold",
                }}
              >
                {place?.timeToTravel}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 8,
              borderRadius: 7,
            }}
          >
            <Ionicons name="navigate" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
