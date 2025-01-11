import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from './../../constants/Colors';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './../../configs/FirebaseConfig';
import UserTripList from '../../components/MyTrips/UserTripList';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PlannedTrips() {
  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(collection(db, 'UserTrips'), where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserTrips((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Planned Trips</Text>
      </View>
      {loading && <ActivityIndicator size={'large'} color={Colors.PRIMARY} />}
      {userTrips?.length === 0 ? <StartNewTripCard /> : <UserTripList userTrips={userTrips} />}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = {
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    marginLeft: 10,
  },
  footer: {
    height: 100,
  },
};