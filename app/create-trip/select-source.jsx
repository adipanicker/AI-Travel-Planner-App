import React, { useEffect, useContext, useState } from "react";
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

export default function SelectSource() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // User input
  const [predictions, setPredictions] = useState([]); // API response

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Select Start Point",
    });
  }, []);

  const handleNextPress = () => {
    if (selectedPlace) {
      setTripData({ ...tripData, startPoint: selectedPlace });
      router.push("/create-trip/search-place");
    }
  };

  // Fetch place predictions using Autocomplete (New) API
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
          "X-Goog-FieldMask": "predictions.description",
        },
        body: JSON.stringify({
          input: query,
        }),
      });

      const data = await response.json();
      console.log("Autocomplete Response:", data); // Debugging

      if (data.predictions) {
        setPredictions(data.predictions.map((item) => item.description));
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/source.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Where are you starting from?</Text>

        {/* Custom Input Field */}
        <TextInput
          style={styles.textInput}
          placeholder="Search for a location"
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
              onPress={() => {
                setSelectedPlace({ name: item });
                setSearchQuery(item);
                setPredictions([]); // Hide suggestions after selection
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
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
