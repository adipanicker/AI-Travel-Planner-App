import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function FlightInfo({ flightData }) {
  // Function to handle the booking button press and open link in external browser
  const handleBookingPress = async () => {
    const url = "https://www.booking.com/flights/";
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      // Opens in external browser without closing the app
      await Linking.openURL(url);
    } else {
      console.log("Cannot open URL");
      // You could add error handling here or show a user message
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        padding: 10,
        borderRadius: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          ✈️ Flights
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 5,
            width: 100,
            borderRadius: 7,
            marginTop: 7,
          }}
          onPress={handleBookingPress}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.WHITE,
              fontFamily: "outfit",
            }}
          >
            Book Here
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          marginTop: 7,
        }}
      >
        Airline: Delta
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
        }}
      >
        Price:{" "}
        {flightData && flightData.price
          ? flightData.price
          : "Prices unavailable"}
      </Text>
    </View>
  );
}
