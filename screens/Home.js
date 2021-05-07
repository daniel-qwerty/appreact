import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import WelcomeScreen from "./WelcomeScreen";
import ProfileScreen from "./ProfileScreen";
import DirectMessagesScreen from "./DirectMessagesScreen";
import FollowersScreen from "./FollowersScreen";
import BillingScreen from "./BillingScreen";
import SettingsScreen from "./SettingsScreen";
import MapScreen from "./MapScreen";
import PaymentScreen from "./StarNigthScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {dark, light} from '../utils/theme';
import { IconButton, Surface } from 'react-native-paper';
import firebase from 'firebase';
import AuthContext from '../auth/context'
import data from '../auth/defaultData';
import * as Location from 'expo-location';


// export default function App() {
//   const Tab = createMaterialBottomTabNavigator();
//   const {authData, setAuthData} = useContext(AuthContext)

//   useEffect(() => {
//     var colection = firebase.firestore()
//       .collection('interactions')
//       .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
//       .where("facility", "==", 18)
//       .where("sent", '==', true)
//     const subscriber = 
//       colection
//       .onSnapshot(documentSnapshot => {
//         console.log(documentSnapshot.size);
//         if(documentSnapshot.size !== 0) {
//           setAuthData({...authData, haveMessages: true})
//         } else {
//           setAuthData({...authData, haveMessages: false})
//         }
//       });
//     return () => subscriber();  
//   }, []);
  

//   return (
    
//     <Tab.Navigator
//       initialRouteName="Home"
//       activeColor="#f0edf6"
//       inactiveColor={theme.colors.accent}
//       barStyle={{
//       backgroundColor: theme.colors.primary
//     }}>
//       <Tab.Screen
//         name="Home"
//         component={MapScreen}
//         options={{
//         tabBarBadge:authData.haveMessages,
//         tabBarBadgeStyle: {backgroundColor:'white'},
//         tabBarLabel: 'Home',
//         tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color={color} size={26}/>)
//       }}/>
//       <Tab.Screen
//         name="Start"
//         component={PaymentScreen}
//         options={{
//         tabBarLabel: 'Start Night',
//         tabBarIcon: ({color}) => (<MaterialCommunityIcons name="weather-night" color={color} size={26}/>)
//       }}/>
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//         tabBarLabel: 'Settings',
//         tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cog" color={color} size={26}/>)
//       }}/>
//        <Tab.Screen
//         name="Only"
//         component={SettingsScreen}
//         options={{
//         tabBarLabel: '',
//         tabBarIcon: ({color}) => (<MaterialCommunityIcons name="crown" color={color} size={26}/>)
//       }}/>
     
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });

// 1 define the task passing its name and a callback that will be called whenever the location changes
// TaskManager.defineTask('TASK_FETCH_LOCATION', async ({ data: { locations }, error }) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   const [location] = locations;
//   try {
  
//     console.log(locations);
//   } catch (err) {
//     console.error(err);
//   }
// });


export default function App() {
const Tab = createMaterialBottomTabNavigator();
const {authData, setAuthData} = useContext(AuthContext)
const [arrayFacilities,setArrayFacilities] = useState([]);
const [location, setLocation] = useState(null);



  
 
  // useEffect(() => {
  //    console.log("object", authData.facilityId);
  //   var colection = firebase.firestore()
  //     .collection('interactions')
  //     .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
  //     .where("facility", "==", authData.facilityId)
  //     .where("sent", '==', true)
   
  //   const subscriber = 
  //     colection
  //     .onSnapshot(documentSnapshot => {
  //        var dataTables = [];  
  //       if(documentSnapshot.size !== 0) {
  //         documentSnapshot.forEach(function (doc) { 
  //             dataTables.push(doc.data())
  //         })
  //         setAuthData({...authData, requestTables: dataTables})
  //       } else {
  //         setAuthData({...authData, requestTables: []})
  //       }
  //     });
  //   return () => subscriber();  
  // }, []);

  function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return (d * 1000);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

  if (location) {
    console.log(location.coords.latitude, location.coords.longitude);
    console.log(
      distance(location.coords.longitude, location.coords.latitude, -63.160573 ,-17.629274)
    );
  } else {
    console.log('cargando...');
  }


 const customTabBarStyle = {
    activeTintColor: 'red',
    inactiveTintColor: 'gray',
    style: {backgroundColor: authData.dark ? dark.colors.background : light.colors.background },
    
}

  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName="Home"
      activeColor={authData.dark ? dark.colors.text : light.colors.text}
      tabBarOptions={customTabBarStyle}
      inactiveColor={authData.dark ? dark.colors.accent : light.colors.accent}
      barStyle={{
        backgroundColor: authData.dark ? dark.colors.primary : light.colors.primary,
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }}
    >
      
    <Tab.Screen
      name="Home"
      options={{
        tabBarBadge:authData.haveMessages,
        tabBarBadgeStyle: {backgroundColor:authData.dark ? dark.colors.background : light.colors.background},
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color}   size={26}/>
        )
      }}
    component={MapScreen}/>

    <Tab.Screen
    name="Start"
    options={{
      tabBarLabel: '',
      tabBarIcon: ({ color }) => (
        <Surface elevation={2} style={authData.dark ? stylesDark.middleButton : styles.middleButton} >
             <View style={{top: 5, alignContent:'center', alignItems:'center'}}>
               <MaterialCommunityIcons name="weather-night" color={authData.dark ? dark.colors.primary : light.colors.primary}  size={26}/>
               <Text style={authData.dark ? stylesDark.middleText : styles.middleText}>Start night</Text>
             </View> 
        
          </Surface>
        )
      }}
    component={PaymentScreen}/>

    <Tab.Screen
    name="Settings"
    options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color }) => (
           <MaterialCommunityIcons name="cog" color={color} size={26}/>
        )
    }}
    component={SettingsScreen} />
    </Tab.Navigator>
  ); 
}



const styles = StyleSheet.create({
  middleButton: {
    position: 'relative',
    bottom: 20, // space from bottombar
    height: 55,
    width: 130,
    borderTopEndRadius:0,
    borderTopLeftRadius:0,
    borderBottomEndRadius:25,
    borderBottomLeftRadius:25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: light.colors.background,
  },
  middleText: {
    color: light.colors.text,
  },
});

const stylesDark = StyleSheet.create({
  middleButton: {
    position: 'relative',
    bottom: 20, // space from bottombar
    height: 55,
    width: 130,
    borderTopEndRadius:0,
    borderTopLeftRadius:0,
    borderBottomEndRadius:25,
    borderBottomLeftRadius:25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: dark.colors.background,
  },
  middleText: {
    color: dark.colors.text,
  },
});



