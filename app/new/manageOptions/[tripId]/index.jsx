import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../../../configs/FirebaseConfig'; // Adjust based on your project structure
import { Colors } from '../../../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Initialize Firestore
const firestore = getFirestore(app);

export default function ManageOptionsIndex() {
  const { tripId } = useLocalSearchParams(); // Use tripId to fetch trip details
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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
          <Ionicons name="cash-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.gridText}>View Expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, styles.notepadButton]}
          onPress={() => router.push(`/new/manageOptions/${tripId}/notepad`)}
        >
          <Ionicons name="book-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.gridText}>View Diary</Text>
        </TouchableOpacity>


        <TouchableOpacity
  style={[styles.gridItem, styles.photosButton]}
  onPress={() => openModal()}
>
  <Ionicons name="images-outline" size={24} color="#fff" style={styles.icon} />
  <Text style={styles.gridText}>Upload Photos/Videos</Text>
</TouchableOpacity>

{/* Modal for Premium Alert */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Upgrade to Premium</Text>
      <Text style={styles.modalMessage}>
        Unlock unlimited cloud storage and enjoy seamless uploads for your
        photos and videos!
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
    flexDirection: 'row',
  },
  gridText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  upgradeButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  
});
