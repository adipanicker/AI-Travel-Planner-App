import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from './../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from './../../configs/FirebaseConfig'
import UserTripList from '../../components/MyTrips/UserTripList';
import { useRouter } from 'expo-router';

export default function MyTrip() {

  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrips();
  }, [user])

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(collection(db, 'UserTrips'),
      where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prev => [...prev, doc.data()])
    });
    setLoading(false);

  }

  const handleChatBotPress = () => {
    router.push('/new/chatBot');
  };

  return (
    <ScrollView style={{
      padding: 25,
      backgroundColor: Colors.WHITE,
      height: '100%',
      paddingTop: 45
    }}>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 35
        }}>My Trips</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleChatBotPress} style={{ marginRight: 10 }}>
            <Ionicons name="sparkles-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/create-trip')}>
            <Ionicons name="add-circle" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {loading && <ActivityIndicator size={'large'} color={Colors.PRIMARY} />}

      {userTrips?.length == 0 ?
        <StartNewTripCard />
        :
        <UserTripList userTrips={userTrips} />
      }
      <View style={{
        height: 100
      }}>

      </View>
      {/* <Text>{JSON.stringify(userTrips[0])}</Text> */}
    </ScrollView>
  )
}