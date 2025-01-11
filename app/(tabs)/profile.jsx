import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { auth } from './../../configs/FirebaseConfig';
import { Colors } from './../../constants/Colors';
import { useRouter } from 'expo-router';

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();
  // Hardcoded username
  const hardcodedUsername = 'EpicTraveler7632'; // Replace with your desired hardcoded name

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert('Logged out', 'You have successfully logged out.');
        router.replace('../../auth/sign-in'); // Redirect to the sign-in page
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  // Get the first letter of the email
  const getInitial = (email) => {
    return email ? email[0].toUpperCase() : 'U'; // Default to 'U' if email is unavailable
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileImage}>
          <Text style={styles.initial}>{getInitial(user?.email)}</Text>
        </View>
        <Text style={styles.name}>{hardcodedUsername}</Text>
        <Text style={styles.email}>{user?.email || 'Loading...'}</Text>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        <TouchableOpacity style={styles.plannedTripsButton} 
          onPress={() => router.push('../../new/plannedTrips')}>
          <Text style={styles.plannedTripsButtonText}>View Planned Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.PRIMARY || '#007bff', // Use your primary color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  initial: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  body: {
    width: '100%',
    paddingHorizontal: 20,
  },
  plannedTripsButton: {
    backgroundColor: '#FFD700', // Golden color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  plannedTripsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.PRIMARY || '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
});
