import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfig';
import AddTrip from '../../components/ManagedTrip/AddTrip';
import TripCard from '../../components/ManagedTrip/TripCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TripManager = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        if (user) {
          const tripsQuery = query(
            collection(db, 'ManagedTrips'),
            where('userEmail', '==', user.email)
          );
          const querySnapshot = await getDocs(tripsQuery);
          const tripData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTrips(tripData);
        }
      } catch (error) {
        console.error('Error fetching trips: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Trip Manager</Text>
        <TouchableOpacity
          onPress={() => router.push('/new/currentTripPlace')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Trip List */}
      {trips.length === 0 ? (
        <AddTrip />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TripCard trip={item} />}
          showsVerticalScrollIndicator={false} // Changed to vertical FlatList
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 25,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default TripManager;
