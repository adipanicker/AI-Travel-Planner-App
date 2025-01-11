import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddTrip = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 10,
          fontFamily: 'outfit-bold',
        }}
      >
        Trip Manager
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 16,
          color: '#555',
          textAlign: 'center',
          marginBottom: 30,
          fontFamily: 'outfit',
        }}
      >
        With the help of Task Manager, you can check your trip expenses, store
        your memories of your trip in the cloud, and add important notes.
      </Text>

      {/* Subheading */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          fontFamily: 'outfit-bold',
        }}
      >
        Add a trip you're currently going to here
      </Text>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => router.push('/new/currentTripPlace')}
        style={{
          width: 70,
          height: 70,
          borderRadius: 35, // Circular shape
          backgroundColor: '#007AFF', // Blue color
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default AddTrip;
