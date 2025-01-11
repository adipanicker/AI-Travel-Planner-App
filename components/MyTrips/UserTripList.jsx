import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import moment from 'moment'
import { Colors } from '../../constants/Colors'
import UserTripCard from './UserTripCard'
import { useRouter } from 'expo-router'
export default function UserTripList({userTrips}) {
    const LatestTrip = JSON.parse(userTrips[userTrips.length - 1].tripData);
    const router=useRouter();

    console.log('LatestTrip:', LatestTrip);
   
  return userTrips&&(
    <View>
      <View style={{
        marginTop:20
      }}>
       {LatestTrip?.location?.photoRef ? (
      <Image
    source={{
      uri:
        'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' +
        LatestTrip.location.photoRef +
        '&key=' +
        process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
    }}
    style={{
      width: '100%',
      height: 240,
      objectFit: 'cover',
      borderRadius: 15,
    }}
          />
) : (
  <Image
    source={require('./../../assets/images/placeholder.jpeg')}
    style={{
      width: '100%',
      height: 240,
      objectFit: 'cover',
      borderRadius: 15,
    }}
  />
)}
        <View style={{marginTop:10}}>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:24
            }}>{userTrips[userTrips.length - 1]?.tripPlan?.travelPlan?.location}</Text>
            <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',marginTop:5
            }}>
            <Text style={{
                fontFamily:'outfit',
                fontSize:17,
                color:Colors.GRAY
            }}>{moment(LatestTrip.startDate).format('DD MMM yyyy')}</Text>

            <Text style={{
                fontFamily:'outfit',
                fontSize:17,
                color:Colors.GRAY
            }}>🚌 {LatestTrip.traveler.title}</Text>
            </View>
            <TouchableOpacity 
            onPress={()=>router.push({pathname:'/trip-details',params:{
                trip:JSON.stringify(userTrips[userTrips.length - 1])
            }})}
            style={{
                backgroundColor:Colors.PRIMARY,
                padding:15,
                borderRadius:15,
                marginTop:10
            }}>
                <Text style={{
                    color:Colors.WHITE,
                    textAlign:'center',
                    fontFamily:'outfit-medium',
                    fontSize:15
                }}>See your plan</Text>
            </TouchableOpacity>
        </View>
            
        {userTrips.map((trip,index)=>(
            <UserTripCard trip={trip} key={index} />
        ))}
      </View>
    </View>
  )
}