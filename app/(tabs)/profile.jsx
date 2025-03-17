import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth } from "./../../configs/FirebaseConfig";
import { Colors } from "./../../constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [hardcodedUsername, setHardcodedUsername] =
    useState("EpicTraveler7632");

  // Default to initial avatar (will be replaced by selected profile pic)
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (username) {
      setHardcodedUsername(username);
    }
  }, [username]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert("Logged out", "You have successfully logged out.");
        router.replace("../../auth/sign-in");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const getInitial = (email) => {
    return email ? email[0].toUpperCase() : "U";
  };

  const navigateToEditProfilePic = () => {
    router.push("/new/editProfilePic");
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Curved Header Background */}
        <View style={styles.headerBackground}>
          <View style={styles.curveShape} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profilePic ? (
              <Image source={profilePic} style={styles.profileImage} />
            ) : (
              <View style={styles.initialContainer}>
                <Text style={styles.initial}>{getInitial(user?.email)}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={navigateToEditProfilePic}
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{hardcodedUsername}</Text>
          <Text style={styles.email}>{user?.email || "Loading..."}</Text>

          {/* <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
          </View> */}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("../../new/plannedTrips")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#FFD700" }]}>
              <Ionicons name="map" size={20} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Planned Trips</Text>
              <Text style={styles.menuSubtitle}>
                View your upcoming adventures
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/new/editProfile/editProfile")}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.PRIMARY || "#007bff" },
              ]}
            >
              <Ionicons name="person" size={20} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Edit Profile</Text>
              <Text style={styles.menuSubtitle}>
                Update your personal information
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/new/settings")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#5856D6" }]}>
              <Ionicons name="settings-sharp" size={20} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>
                App preferences and controls
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: "#dc3545" }]}>
              <Ionicons name="log-out" size={20} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Logout</Text>
              <Text style={styles.menuSubtitle}>
                Sign out from your account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerBackground: {
    width: "100%",
    height: 150,
    backgroundColor: Colors.PRIMARY || "#007bff",
    position: "absolute",
    top: 0,
  },
  curveShape: {
    width: "100%",
    height: 70,
    backgroundColor: "#f8f9fa",
    position: "absolute",
    bottom: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileSection: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 90,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  initialContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.PRIMARY || "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  initial: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "bold",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY || "#007bff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY || "#007bff",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
