import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get("window");

const TripCard = ({ trip }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  if (!trip.id) return null;

  // Handle case where tripName is an object
  const renderTripName = () => {
    if (typeof trip.tripName === "object" && trip.tripName !== null) {
      return trip.tripName.text || "Unknown Place";
    }
    return trip.tripName || "Unknown Place";
  };

  // Debug logging - remove after debugging
  console.log("Trip data:", JSON.stringify(trip, null, 2));
  console.log("Image URL:", trip.imageUrl);

  return (
    <View style={styles.card}>
      {/* Image Section with error handling */}
      <Image
        source={{
          uri:
            trip.imageUrl ||
            "https://via.placeholder.com/400x200/cccccc/666666?text=No+Image",
        }}
        style={styles.image}
        defaultSource={require("../../assets/images/5.png")} // Add a local placeholder image
        onError={(e) =>
          console.log("Image loading error:", e.nativeEvent.error)
        }
      />

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{renderTripName()}</Text>
      </View>

      {/* Manage Trip Button */}
      <TouchableOpacity
        onPress={() => router.push(`/new/manageOptions/${trip.id}`)}
        style={styles.manageButton}
      >
        <Text style={styles.manageText}>Manage Trip</Text>
      </TouchableOpacity>

      {/* Favourites Button */}
      <TouchableOpacity
        onPress={() => setIsFavorite(!isFavorite)}
        style={styles.favoritesButton}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "red" : "gray"}
          style={styles.favoritesIcon}
        />
        <Text style={styles.favoritesText}>
          {isFavorite ? "Added to Favourites" : "Add to Favourites"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    overflow: "hidden",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#f0f0f0", // Placeholder background color
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  manageButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  manageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  favoritesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  favoritesIcon: {
    marginRight: 8,
  },
  favoritesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

// Updated PropTypes
TripCard.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tripName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        text: PropTypes.string,
        languageCode: PropTypes.string,
      }),
    ]),
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default TripCard;
