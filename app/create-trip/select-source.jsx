import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CreateTripContext } from './../../context/CreateTripContext';
import { Colors } from '../../constants/Colors';

export default function SelectSource() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const [selectedPlace, setSelectedPlace] = useState(null); // State to track selected place

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Select Start Point',
    });
  }, []);

  const handleNextPress = () => {
    if (selectedPlace) {
      setTripData({ ...tripData, startPoint: selectedPlace }); // Save the place in the context
      router.push('/create-trip/search-place'); // Navigate to the next page
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/source.jpg')} // Background image
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Title */}
        <Text style={styles.title}>Where are you starting from?</Text>

        {/* Google Places Autocomplete */}
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            setSelectedPlace({
              name: data.description,
              location: details?.geometry?.location,
            });
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
            language: 'en',
          }}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
          }}
        />

        {/* NEXT Button */}
        {selectedPlace && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextPress}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'outfit-bold',
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
  },
  listView: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
