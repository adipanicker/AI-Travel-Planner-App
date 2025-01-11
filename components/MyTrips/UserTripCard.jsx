import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function UserTripCard({ trip }) {
  const [showMoveButton, setShowMoveButton] = useState(false);
  const formatData = (data) => {
    return JSON.parse(data);
  };
  const router = useRouter();

  const handleLongPress = () => {
    setShowMoveButton(true);
  };

  const handlePressOutside = () => {
    setShowMoveButton(false);
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      onPress={() => router.push({ pathname: '/trip-details', params: { trip: JSON.stringify(trip) } })}
      style={{
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={{
          uri:
            'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' +
            formatData(trip.tripData).location?.photoRef +
            '&key=' +
            process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
        }}
      />
      <View>
        <Text
          style={{
            fontFamily: 'outfit-medium',
            fontSize: 18,
          }}
        >
          {trip.tripPlan?.travelPlan?.location || trip.tripPlan?.tripPlan?.destination}
        </Text>
        <Text
          style={{
            fontFamily: 'outfit',
            fontSize: 14,
            color: Colors.GRAY,
          }}
        >
          {moment(formatData(trip.tripData).startDate).format('DD MMM yyyy')}
        </Text>
        <Text
          style={{
            fontFamily: 'outfit',
            fontSize: 14,
            color: Colors.GRAY,
          }}
        >
          Traveling: {formatData(trip.tripData).traveler.title}
        </Text>
      </View>
      {showMoveButton && (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 10,
            borderRadius: 5,
            marginLeft: 'auto',
            marginTop: 'auto',
          }}
          onPress={() => Alert.alert('Move to Home Screen', 'This button will move the trip to the home screen.')}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: 'outfit-medium',
              fontSize: 14,
            }}
          >
            Move to Home
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}