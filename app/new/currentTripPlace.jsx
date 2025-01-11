import { View, Text, Button } from 'react-native';
import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { auth } from '../../configs/FirebaseConfig';

export default function CurrentTripPlace() {
  const router = useRouter(); // Using Expo Router
  const [placeDetails, setPlaceDetails] = useState(null); // To store selected place details

  const handlePlaceSubmit = async () => {
    if (placeDetails) {
      try {
        const docRef = await addDoc(collection(db, 'ManagedTrips'), {
          tripName: placeDetails.name,
          location: placeDetails.location || {},
          imageUrl: placeDetails.imageUrl || null,
          userEmail: auth.currentUser?.email || 'unknown', // Add userEmail here
          createdAt: new Date(),
        });
  
        console.log('Trip added with ID: ', docRef.id);
        router.push('/(tabs)/tripManager');
      } catch (error) {
        console.error('Error adding trip: ', error);
      }
    } else {
      console.error('No place details available to submit.');
    }
  };
  

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        Add Your Trip Place
      </Text>
      <GooglePlacesAutocomplete
        placeholder="Search Place"
        fetchDetails={true}
        onPress={(data, details = null) => {
          const location = details?.geometry?.location || {};
          const photoRef = details?.photos?.[0]?.photo_reference;
          const imageUrl = photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : null;

          // Only storing necessary and available data
          setPlaceDetails({
            name: data.description || null,
            location, // Coordinates (lat/lng) if available
            imageUrl, // Image URL if available
          });

          console.log('Selected Place Details:', {
            name: data.description,
            location,
            imageUrl,
          });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          language: 'en',
        }}
        styles={{
          textInputContainer: {
            borderWidth: 1,
            borderRadius: 5,
            marginTop: 25,
          },
          textInput: {
            fontSize: 16,
          },
        }}
      />
      {placeDetails && (
        <Button title="Submit Trip" onPress={handlePlaceSubmit} />
      )}
    </View>
  );
}
