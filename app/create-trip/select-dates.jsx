import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function SelectDates() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const onDateChange = (date, type) => {
    console.log(date, type);
    setErrorMessage(""); // Clear error message on new selection

    if (type === "START_DATE") {
      setStartDate(moment(date));
      // If end date exists and is now invalid, reset it
      if (endDate && moment(date).isSameOrAfter(endDate)) {
        setEndDate(null);
      }
    } else {
      const proposedEndDate = moment(date);

      // Check if end date is same as start date
      if (startDate && proposedEndDate.isSame(startDate, "day")) {
        setErrorMessage(
          "End date cannot be the same as start date. Please select at least a 2-day trip."
        );
        return;
      }

      // Ensure end date is after start date
      if (startDate && proposedEndDate.isBefore(startDate)) {
        setErrorMessage("End date must be after start date");
        return;
      }

      setEndDate(proposedEndDate);
    }
  };

  const OnDateSelectionContinue = () => {
    // Validate both dates are selected
    if (!startDate || !endDate) {
      const message =
        !startDate && !endDate
          ? "Please select both start and end dates"
          : !startDate
          ? "Please select a start date"
          : "Please select an end date";

      setErrorMessage(message);
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    // Validate dates are not the same (minimum 2-day trip)
    if (startDate.isSame(endDate, "day")) {
      const message =
        "Your trip must be at least 2 days. Please select a different end date.";
      setErrorMessage(message);
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    const totalNoOfDays = endDate.diff(startDate, "days");
    console.log(totalNoOfDays + 1);

    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    });

    router.push("/create-trip/select-budget");
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
          fontFamily: "outfit-bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Travel Dates
      </Text>

      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 16,
          marginTop: 5,
          color: Colors.GRAY,
        }}
      >
        Select start and end dates for your trip (minimum 2-day trip required)
      </Text>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={10}
          selectedRangeStyle={{
            backgroundColor: Colors.PRIMARY,
          }}
          selectedDayTextStyle={{
            color: Colors.WHITE,
          }}
        />
      </View>

      {errorMessage ? (
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: "red",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {errorMessage}
        </Text>
      ) : null}

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontFamily: "outfit-medium", fontSize: 16 }}>
          {startDate
            ? `Start: ${startDate.format("MMM DD, YYYY")}`
            : "Start date: Not selected"}
        </Text>
        <Text
          style={{ fontFamily: "outfit-medium", fontSize: 16, marginTop: 5 }}
        >
          {endDate
            ? `End: ${endDate.format("MMM DD, YYYY")}`
            : "End date: Not selected"}
        </Text>
        {startDate && endDate ? (
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 16,
              marginTop: 5,
              color: Colors.PRIMARY,
            }}
          >
            Trip duration: {endDate.diff(startDate, "days") + 1} days
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={OnDateSelectionContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
