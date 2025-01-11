import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../../../configs/FirebaseConfig'; // Adjust based on your project structure
import {Colors} from '../../../../constants/Colors';

// Initialize Firestore
const firestore = getFirestore(app);

export default function ManageOptionsIndex() {
  const { tripId } = useLocalSearchParams(); // Use tripId to fetch trip details
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      console.error('Trip ID is missing');
      setTripName('Unknown');
      setLoading(false);
      return;
    }

    const fetchTripDetails = async () => {
      try {
        const tripDoc = await getDoc(doc(firestore, 'ManagedTrips', tripId));
        if (tripDoc.exists()) {
          const fullTripName = tripDoc.data().tripName || 'Unknown';
          const shortTripName = fullTripName.split(',')[0]; // Extract the first word
          setTripName(shortTripName);
        } else {
          console.error(`No trip found for tripId: ${tripId}`);
          setTripName('Unknown');
        }
      } catch (error) {
        console.error(`Error fetching trip details for tripId: ${tripId}`, error);
        setTripName('Unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trip Name */}
        <Text style={styles.title}>{tripName} Trip</Text>

        {/* Subheading */}
        <Text style={styles.subtitle}>Manage your trip below:</Text>

        {/* Options List */}
        <TouchableOpacity
          style={[styles.gridItem, styles.expensesButton]}
          onPress={() => router.push(`/new/manageOptions/${tripId}/expenses`)}
        >
          <Text style={styles.gridText}>View Expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, styles.notepadButton]}
          onPress={() => router.push(`/new/manageOptions/${tripId}/notepad`)}
        >
          <Text style={styles.gridText}>View Notepad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, styles.photosButton]}
          onPress={() => alert('Feature coming soon!')}
        >
          <Text style={styles.gridText}>Upload Photos/Videos</Text>
        </TouchableOpacity>
        <Image style={{width: '80%', height: 280}} source={require("../../../../assets/images/4.png")}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light background for modern design
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
    color: '#333', // Dark gray for the title
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'outfit-medium', // Lighter gray for the subtitle
    marginBottom: 20,
  },
  gridItem: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 3,
    height: 100,
  },
  gridText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  expensesButton: {
    backgroundColor: Colors.PRIMARY, // Soft blue
  },
  notepadButton: {
    backgroundColor: Colors.PRIMARY, // Green
  },
  photosButton: {
    backgroundColor: Colors.PRIMARY, // Red
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
   
  },
});
