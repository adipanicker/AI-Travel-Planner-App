import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window'); // Get screen width dynamically

const TripCard = ({ trip }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  if (!trip.id) return null;

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <Image
        source={{ uri: trip.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{trip.tripName || 'Unknown Place'}</Text>
      </View>

      {/* Manage Trip Button */}
      <TouchableOpacity
        onPress={() => router.push(`/new/manageOptions/${trip.id}`)}
        style={styles.manageButton}
      >
        <Text style={styles.manageText}>Manage Trip</Text>
      </TouchableOpacity>

      {/* Favourites Button */}
      <TouchableOpacity
        onPress={() => setIsFavorite(!isFavorite)}
        style={styles.favoritesButton}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'} // Icon changes based on state
          size={24}
          color={isFavorite ? 'red' : 'gray'} // Icon color changes based on state
          style={styles.favoritesIcon}
        />
        <Text style={styles.favoritesText}>
          {isFavorite ? 'Added to Favourites' : 'Add to Favourites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 40, // Full width with padding
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 200, // Increased height for a larger image
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  manageButton: {
    backgroundColor: Colors.PRIMARY ,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  manageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favoritesButton: {
    flexDirection: 'row', // Horizontal alignment for icon and text
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  favoritesIcon: {
    marginRight: 8, // Space between icon and text
  },
  favoritesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

TripCard.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tripName: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default TripCard;
