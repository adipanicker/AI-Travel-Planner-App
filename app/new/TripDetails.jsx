import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TripDetails = () => {
  const router = useRouter();
  const { trip } = useLocalSearchParams();

  const handleLetsGoPress = () => {
    router.push('/create-trip');
  };

  const handleBackPress = () => {
    router.back();
  };

  const tripData = JSON.parse(trip);

  const gradients = [
    ['#ffafbd', '#ffc3a0'],
    ['#2193b0', '#6dd5ed'],
    ['#cc2b5e', '#753a88'],
    ['#ee9ca7', '#ffdde1'],
    ['#42275a', '#734b6d'],
  ];

  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <LinearGradient
      colors={randomGradient}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title1}>
        Ready to plan your  </Text> 
        <Text style={styles.highlight}>{tripData.name}</Text>     
          <Text style={styles.title2}> trip?
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLetsGoPress}>
        <Text style={styles.buttonText}>Let's Go!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title1: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  title2: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: 'gold',
    fontSize: 28,
    fontFamily:'outfit-bold',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 20,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TripDetails;
