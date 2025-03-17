import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { internationalData, indianData } from "./tripData";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Discover = () => {
  const [internationalTrips, setInternationalTrips] = useState([]);
  const [indianTrips, setIndianTrips] = useState([]);
  const [displayedInternationalTrips, setDisplayedInternationalTrips] =
    useState([]);
  const [displayedIndianTrips, setDisplayedIndianTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setInternationalTrips(internationalData);
      setDisplayedInternationalTrips(internationalData.slice(0, 5));
      setIndianTrips(indianData);
      setDisplayedIndianTrips(indianData.slice(0, 5));
      setLoading(false);
    }, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      const newInternationalTrips = internationalTrips
        .slice(5)
        .concat(internationalTrips.slice(0, 5));
      const newIndianTrips = indianTrips
        .slice(5)
        .concat(indianTrips.slice(0, 5));
      setInternationalTrips(newInternationalTrips);
      setIndianTrips(newIndianTrips);
      setDisplayedInternationalTrips(newInternationalTrips.slice(0, 5));
      setDisplayedIndianTrips(newIndianTrips.slice(0, 5));
      setRefreshing(false);
    }, 1000);
  };

  const handleTripPress = (trip) => {
    router.push({
      pathname: "/new/TripDetails",
      params: { trip: JSON.stringify(trip) },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Finding amazing destinations...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={[Colors.PRIMARY, "#1a3c88"]}
        style={styles.heroContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.heroTitle}>Discover Travel Packages</Text>
        <Text style={styles.heroSubtitle}>Find your perfect getaway</Text>
      </LinearGradient>

      {/* World Map Image */}
      <View style={styles.mapContainer}>
        <Image
          style={styles.mapImage}
          source={require("../../assets/images/10.png")}
          resizeMode="contain"
        />
        <View style={styles.overlayTextContainer}>
          <Text style={styles.overlayTitle}>
            Explore Your Dream Destinations
          </Text>
          <Text style={styles.overlaySubtitle}>
            Plan your expertly curated trips designed for unforgettable
            experiences
          </Text>
        </View>
      </View>

      {/* Featured International Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>International Escapes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        {displayedInternationalTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.card}
            onPress={() => handleTripPress(trip)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: trip.imageUrl }} style={styles.cardImage} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.cardGradient}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTag}>FEATURED</Text>
              <Text style={styles.cardTitle}>{trip.name}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {trip.description}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <View style={styles.cardAction}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.PRIMARY}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Indian Destinations Section - Now matching International style */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Indian Treasures</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        {displayedIndianTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.card}
            onPress={() => handleTripPress(trip)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: trip.imageUrl }} style={styles.cardImage} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.cardGradient}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTag}>FEATURED</Text>
              <Text style={styles.cardTitle}>{trip.name}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {trip.description}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <View style={styles.cardAction}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.PRIMARY}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "outfit-medium",
    color: Colors.PRIMARY,
  },
  heroContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "white",
    marginTop: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  mapContainer: {
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  mapImage: {
    width: "100%",
    height: 400,
  },
  overlayTextContainer: {
    marginTop: 5,
    paddingHorizontal: 15,
  },
  overlayTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 8,
  },
  overlaySubtitle: {
    fontFamily: "outfit",
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    lineHeight: 20,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: Colors.PRIMARY,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  cardTag: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: "outfit-bold",
    color: "white",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "white",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "outfit-medium",
    fontSize: 14,
    color: "white",
    marginLeft: 4,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  exploreText: {
    fontFamily: "outfit-medium",
    fontSize: 12,
    color: Colors.PRIMARY,
    marginRight: 4,
  },
  // Keeping the list styles for reference but they're no longer used
  listCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  listInfo: {
    flex: 1,
    padding: 12,
  },
  listName: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "#555",
    marginBottom: 8,
    lineHeight: 16,
  },
  listMeta: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "outfit",
    color: "#777",
    marginLeft: 4,
  },
  bottomPadding: {
    height: 80,
  },
});

export default Discover;
