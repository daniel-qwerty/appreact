import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
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
import {theme} from '../utils/theme';
import { IconButton, Surface } from 'react-native-paper';
import firebase from 'firebase';

export default function App() {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor={theme.colors.accent}
      barStyle={{
      backgroundColor: theme.colors.primary
    }}>
      <Tab.Screen
        name="Home"
        component={MapScreen}
        options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color={color} size={26}/>)
      }}/>
      <Tab.Screen
        name="Start"
        component={PaymentScreen}
        options={{
        tabBarLabel: 'Start Night',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="weather-night" color={color} size={26}/>)
      }}/>
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cog" color={color} size={26}/>)
      }}/>
       <Tab.Screen
        name="Only"
        component={SettingsScreen}
        options={{
        tabBarLabel: '',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="crown" color={color} size={26}/>)
      }}/>
     
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


// export default function App({navigation}) {
// const Tab = createMaterialBottomTabNavigator();

// useEffect(() => {
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user != null) {
    
//         console.log(user);
//       }
//     })
//   }, []);


//  const customTabBarStyle = {
//     activeTintColor: '#ed',
//     inactiveTintColor: 'gray',
//     style: {backgroundColor: 'white' },
    
// }

//   return (
//     <Tab.Navigator
//       shifting={true}
//       initialRouteName="Home"
//       activeColor="#f0edf6"
//       tabBarOptions={customTabBarStyle}
//       inactiveColor={theme.colors.accent}
//       barStyle={{
//         backgroundColor: theme.colors.primary,
//         elevation: 0, // remove shadow on Android
//         shadowOpacity: 0, // remove shadow on iOS
//       }}
//     >
      
//     <Tab.Screen
//       name="Home"
//       options={{
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="home" color={color}   size={26}/>
//           )
//       }}
//     component={MapScreen}/>

//     <Tab.Screen
//     name="Start"
//     options={{
//       tabBarLabel: '',
//       tabBarIcon: ({ color }) => (
//         <Surface elevation={2} style={styles.middleButton} >
//              <View style={{top: 5, alignContent:'center', alignItems:'center'}}>
//                <MaterialCommunityIcons name="weather-night" color={theme.colors.primary}  size={26}/>
//                <Text>Start night</Text>
//              </View> 
        
//           </Surface>
//         )
//       }}
//     component={PaymentScreen}/>

//     <Tab.Screen
//     name="Settings"
//     options={{
//         tabBarLabel: 'Settings',
//         tabBarIcon: ({ color }) => (
//            <MaterialCommunityIcons name="cog" color={color} size={26}/>
//         )
//     }}
//     component={SettingsScreen} />
//     </Tab.Navigator>
//   ); 
// }

// const styles = StyleSheet.create({
//   middleButton: {
//     position: 'relative',
//     bottom: 20, // space from bottombar
//     height: 55,
//     width: 130,
//     borderTopEndRadius:0,
//     borderTopLeftRadius:0,
//     borderBottomEndRadius:25,
//     borderBottomLeftRadius:25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor:'white',
//   }
// });


