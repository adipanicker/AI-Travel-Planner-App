import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlaceApi";

export default function HotelCard({ item }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    try {
      // Assuming GetPhotoRef returns a photo resource name from the new API
      const photoRef = await GetPhotoRef(item.hotelName);

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
        marginRight: 20,
        width: 180,
      }}
    >
      {loading ? (
        <View
          style={{
            width: 180,
            height: 120,
            borderRadius: 15,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <Image
          source={{ uri: photoUrl }}
          style={{
            width: 180,
            height: 120,
            borderRadius: 15,
          }}
          defaultSource={require("../../assets/images/placeholder.jpeg")} // Add a local placeholder image
        />
      )}

      <View
        style={{
          padding: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 17,
          }}
        >
          {item.hotelName}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
            }}
          >
            ⭐ {item.rating}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
            }}
          >
            💰 {item.price}
          </Text>
        </View>
      </View>
    </View>
  );
}
