import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth } from '../../../configs/FirebaseConfig';// Update path if needed
import { useRouter } from "expo-router";

const EditProfile = () => {
  const user = auth.currentUser;
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Profile Picture Section */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{
            uri: user?.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKNwJz-vhaZVskyf7rLnoAVlsZSQz7oYkA4XrR_-PD53HLb1-UT2IC4q6V-s_rmPrelMo&usqp=CAU", // Use user's profile pic or a placeholder
          }}
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/new/editProfile/editUsername")}
        >
          <Text style={styles.buttonText}>Edit Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Email Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfile;
