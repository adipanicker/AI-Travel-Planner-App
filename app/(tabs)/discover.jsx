import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { internationalData, indianData } from './tripData';
import { useRouter } from 'expo-router';

const Discover = () => {
  const [internationalTrips, setInternationalTrips] = useState([]);
  const [indianTrips, setIndianTrips] = useState([]);
  const [displayedInternationalTrips, setDisplayedInternationalTrips] = useState([]);
  const [displayedIndianTrips, setDisplayedIndianTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setInternationalTrips(internationalData);
    setDisplayedInternationalTrips(internationalData.slice(0, 5));
    setIndianTrips(indianData);
    setDisplayedIndianTrips(indianData.slice(0, 5));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    const newInternationalTrips = internationalTrips.slice(5).concat(internationalTrips.slice(0, 5));
    const newIndianTrips = indianTrips.slice(5).concat(indianTrips.slice(0, 5));
    setInternationalTrips(newInternationalTrips);
    setIndianTrips(newIndianTrips);
    setDisplayedInternationalTrips(newInternationalTrips.slice(0, 5));
    setDisplayedIndianTrips(newIndianTrips.slice(0, 5));
    setRefreshing(false);
  };

  const handleTripPress = (trip) => {
    router.push({
      pathname: '/new/TripDetails',
      params: { trip: JSON.stringify(trip) },
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Discover Travel Packages</Text>
      </View>

      <Text style={styles.sectionTitle}>International Trips</Text>
      {displayedInternationalTrips.map((trip) => (
        <TouchableOpacity key={trip.id} style={styles.card} onPress={() => handleTripPress(trip)}>
          <Image source={{ uri: trip.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{trip.name}</Text>
            <Text style={styles.description}>{trip.description}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Indian Trips</Text>
      {displayedIndianTrips.map((trip) => (
        <TouchableOpacity key={trip.id} style={styles.card} onPress={() => handleTripPress(trip)}>
          <Image source={{ uri: trip.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{trip.name}</Text>
            <Text style={styles.description}>{trip.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Image style={{width: '80%', height: 280, paddingLeft: 20}} source={require("../../assets/images/10.png")}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    color: 'white',
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    marginHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'outfit-bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
  },
});

export default Discover;