import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "./../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./../../../configs/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if email is verified
        if (user.emailVerified) {
          // User is verified, proceed to app
          router.replace("/mytrip");
        } else {
          // Check if this user needs strict verification
          AsyncStorage.getItem(`strictVerify_${user.uid}`)
            .then((requiresVerification) => {
              if (requiresVerification === "true") {
                // This user needs to verify their email first - sign them out
                auth.signOut();
              }
              // For other users, do nothing - let them stay signed in
              // They'll see the reminder when they open the app
            })
            .catch((err) => {
              console.log("Error checking verification requirement:", err);
            });
        }
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [router]);

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please Enter Email & Password", ToastAndroid.LONG);
      return;
    }

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);

        // First check if email is verified
        if (!user.emailVerified) {
          // Check if this is a new user who requires strict verification
          AsyncStorage.getItem(`strictVerify_${user.uid}`)
            .then((requiresVerification) => {
              setLoading(false);

              if (requiresVerification === "true") {
                // This is a new user - enforce strict verification
                Alert.alert(
                  "Email Verification Required",
                  "As a new user, you must verify your email before accessing the app. Please check your inbox for the verification link.",
                  [
                    {
                      text: "Resend Verification Email",
                      onPress: () => {
                        sendEmailVerification(user)
                          .then(() => {
                            ToastAndroid.show(
                              "Verification email sent!",
                              ToastAndroid.LONG
                            );
                            // Sign out after resending
                            auth.signOut();
                          })
                          .catch((error) => {
                            ToastAndroid.show(
                              "Error sending verification email",
                              ToastAndroid.LONG
                            );
                            console.log(error);
                            // Sign out on error
                            auth.signOut();
                          });
                      },
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        // Sign out user if they're not verified
                        auth.signOut();
                      },
                      style: "default",
                    },
                  ]
                );
              } else {
                // This is an existing user - show a reminder but allow access
                Alert.alert(
                  "Email Verification Reminder",
                  "We've noticed your email is not verified yet. Verifying helps secure your account.",
                  [
                    {
                      text: "Resend Verification Email",
                      onPress: () => {
                        sendEmailVerification(user)
                          .then(() => {
                            ToastAndroid.show(
                              "Verification email sent!",
                              ToastAndroid.LONG
                            );
                          })
                          .catch((error) => {
                            ToastAndroid.show(
                              "Error sending verification email",
                              ToastAndroid.LONG
                            );
                            console.log(error);
                          });
                      },
                    },
                    {
                      text: "Continue Anyway",
                      onPress: () => router.replace("/mytrip"),
                      style: "default",
                    },
                  ]
                );
              }
            })
            .catch((error) => {
              // Error reading from storage, fall back to the non-strict behavior
              setLoading(false);
              console.log("Error checking user verification status:", error);

              // Show the regular reminder dialog
              Alert.alert(
                "Email Verification Reminder",
                "We've noticed your email is not verified yet. Verifying helps secure your account.",
                [
                  {
                    text: "Resend Verification Email",
                    onPress: () => {
                      sendEmailVerification(user)
                        .then(() => {
                          ToastAndroid.show(
                            "Verification email sent!",
                            ToastAndroid.LONG
                          );
                        })
                        .catch((error) => {
                          ToastAndroid.show(
                            "Error sending verification email",
                            ToastAndroid.LONG
                          );
                          console.log(error);
                        });
                    },
                  },
                  {
                    text: "Continue Anyway",
                    onPress: () => router.replace("/mytrip"),
                    style: "default",
                  },
                ]
              );
            });
        } else {
          // Email is verified, proceed normally
          setLoading(false);
          router.replace("/mytrip");
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);

        if (errorCode === "auth/invalid-credential") {
          ToastAndroid.show("Invalid credentials", ToastAndroid.LONG);
        } else if (errorCode === "auth/user-not-found") {
          ToastAndroid.show("User not found", ToastAndroid.LONG);
        } else if (errorCode === "auth/wrong-password") {
          ToastAndroid.show("Wrong password", ToastAndroid.LONG);
        } else {
          ToastAndroid.show(
            "Something went wrong. Try again.",
            ToastAndroid.LONG
          );
        }
      });
  };

  const handleForgotPassword = () => {
    // Pre-fill with the email from the login form if available
    if (email) {
      setResetEmail(email);
    }
    setResetModalVisible(true);
  };

  const sendResetEmail = () => {
    if (!resetEmail) {
      ToastAndroid.show("Please enter your email", ToastAndroid.LONG);
      return;
    }

    setResetLoading(true);

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setResetLoading(false);
        setResetModalVisible(false);
        Alert.alert(
          "Reset Email Sent",
          "Check your email for a link to reset your password. Check your spam folder if you don't see it."
        );
      })
      .catch((error) => {
        setResetLoading(false);
        console.log(error);

        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          ToastAndroid.show(
            "No account found with this email",
            ToastAndroid.LONG
          );
        } else if (errorCode === "auth/invalid-email") {
          ToastAndroid.show("Invalid email format", ToastAndroid.LONG);
        } else {
          ToastAndroid.show(
            "Error sending reset email. Try again.",
            ToastAndroid.LONG
          );
        }
      });
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 40,
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
        Let's Sign You In
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 30,
          color: Colors.GRAY,
          marginTop: 20,
        }}
      >
        Welcome Back
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 30,
          color: Colors.GRAY,
          marginTop: 10,
        }}
      >
        You've been missed!
      </Text>

      {/* Email  */}
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "outfit" }}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          placeholder="Enter Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {/* Password  */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit" }}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          placeholder="Enter Password"
        />
      </View>

      {/* Sign In Button  */}
      <TouchableOpacity
        onPress={onSignIn}
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
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Create Account Button  */}
      <TouchableOpacity
        onPress={() => router.replace("auth/sign-up")}
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
          Create Account
        </Text>
      </TouchableOpacity>

      {/* Forgot Password Button  */}
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={{
          padding: 20,
          backgroundColor: Colors.WHITE,
          borderRadius: 15,
          marginTop: 20,
          borderWidth: 1,
        }}
        disabled={loading}
      >
        <Text
          style={{
            color: Colors.PRIMARY,
            textAlign: "center",
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Forgot Password Modal */}
      <Modal
        visible={resetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalText}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>

            <TextInput
              style={[styles.input, { width: "100%", marginBottom: 20 }]}
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={resetEmail}
              onChangeText={setResetEmail}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setResetModalVisible(false)}
                disabled={resetLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonSend,
                  resetLoading && { backgroundColor: Colors.GRAY },
                ]}
                onPress={sendResetEmail}
                disabled={resetLoading}
              >
                <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginBottom: 15,
  },
  modalText: {
    fontFamily: "outfit",
    marginBottom: 15,
    color: Colors.GRAY,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  buttonSend: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    fontFamily: "outfit",
  },
});
