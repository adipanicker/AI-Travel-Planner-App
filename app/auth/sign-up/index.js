import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./../../../configs/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const OnCreateAccount = () => {
    if (!email && !password && !fullName) {
      ToastAndroid.show("Please enter all details", ToastAndroid.LONG);
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);

        // Store a flag in local storage to identify this as a new user who needs strict verification
        AsyncStorage.setItem(`strictVerify_${user.uid}`, "true")
          .then(() => {
            console.log("Strict verification flag set for new user");
          })
          .catch((err) => {
            console.log("Error setting verification flag:", err);
          });

        // Send verification email
        sendEmailVerification(user)
          .then(() => {
            // Email sent successfully
            setLoading(false);

            // Sign out the user after account creation
            auth.signOut().then(() => {
              // Show success alert
              Alert.alert(
                "Verification Email Sent",
                "Please check your email and verify your account before signing in. Verification is required to use the app.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/auth/sign-in"),
                  },
                ]
              );
            });
          })
          .catch((verificationError) => {
            setLoading(false);
            ToastAndroid.show(
              "Error sending verification email: " + verificationError.message,
              ToastAndroid.LONG
            );
            console.log("Verification error:", verificationError);

            // Sign out and redirect to sign-in even if verification email fails
            auth.signOut().then(() => {
              router.replace("/auth/sign-in");
            });
          });
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        ToastAndroid.show(errorCode, ToastAndroid.LONG);
        console.log("--", errorMessage, errorCode);
      });
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 50,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
          marginTop: 30,
        }}
      >
        Create New Account
      </Text>

      {/* User Full Name  */}
      <View
        style={{
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Full Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          onChangeText={(value) => setFullName(value)}
        />
      </View>
      {/* Email  */}
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Email
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          placeholder="Enter Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {/* Password  */}
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Password
        </Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          placeholder="Enter Password"
        />
      </View>

      {/* Sign Up Button  */}
      <TouchableOpacity
        onPress={OnCreateAccount}
        disabled={loading}
        style={{
          padding: 20,
          backgroundColor: loading ? Colors.GRAY : Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      {/* Sign In Button  */}
      <TouchableOpacity
        onPress={() => router.replace("auth/sign-in")}
        disabled={loading}
        style={{
          padding: 20,
          backgroundColor: Colors.WHITE,
          borderRadius: 15,
          marginTop: 20,
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            color: Colors.PRIMARY,
            textAlign: "center",
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    fontFamily: "outfit",
  },
});
