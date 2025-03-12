import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const RateUs = () => {
  const [rating, setRating] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const emojis = {
    1: '😢',
    2: '😟',
    3: '😔',
    4: '😊',
    5: '🤩',
  };

  const handleConfirm = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before confirming.');
      return;
    }
    setConfirmed(true);
    Alert.alert('Thank you!', 'Thank you for rating us.');
  };

  return (
    <LinearGradient
      colors={['white', 'white']}
      style={styles.container}
    >
      <Text style={styles.title}>How did you like using our app?</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? '#FFD700' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <Text style={styles.emoji}>{emojis[rating]}</Text>
      )}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RateUs;
