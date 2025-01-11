import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function TripGuide() {
  const router = useRouter();

  const handleLetsGoPress = () => {
    // Navigate to the next screen using Expo Router
    router.push('/create-trip/select-source'); // Update with the correct route
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Animation */}
      <LottieView
        source={require('../../assets/images/animation.json')} // Update the path as needed
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Title */}
      <Text style={styles.title}>Plan Your Next Adventure!</Text>

      {/* Instructions */}
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>1. Select Start Point</Text>
        </View>

        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>2. Choose Your Destination</Text>
        </View>

        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>3. Who's Coming Along?</Text>
        </View>

        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>4. Select Your Travel Date</Text>
        </View>

        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>5. Set Your Budget</Text>
        </View>

        <View style={styles.step}>
          <Image
            source={require('../../assets/images/login.jpeg')} // Correct the path
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>6. Let AI Work Its Magic!</Text>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity style={styles.button} onPress={handleLetsGoPress}>
        <Text style={styles.buttonText}>Let's Go!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: Dimensions.get('window').width * 0.8,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    marginBottom: 30,
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    fontFamily: 'outfit-medium'
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
