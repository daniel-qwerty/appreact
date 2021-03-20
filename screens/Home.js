import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import WelcomeScreen from "./WelcomeScreen";
import ProfileScreen from "./ProfileScreen";
import DirectMessagesScreen from "./DirectMessagesScreen";
import FollowersScreen from "./FollowersScreen";
import BillingScreen from "./BillingScreen";
import SettingsScreen from "./SettingsScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../utils/theme';

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
        name="Profile"
        component={ProfileScreen}
        options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="account" color={color} size={26}/>)
      }}/>
      <Tab.Screen
        name="Followers"
        component={FollowersScreen}
        options={{
        tabBarLabel: 'Followers',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="account-group-outline" color={color} size={26}/>)
      }}/>
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{
        tabBarLabel: 'Billing',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cash-multiple" color={color} size={26}/>)
      }}/>
       <Tab.Screen
        name="DM"
        component={DirectMessagesScreen}
        options={{
        tabBarLabel: 'Messages',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cellphone-message" color={color} size={26}/>)
      }}/>
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
        tabBarLabel: 'Settings',
        color: 'red',
        tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cog" color={color} size={26}/>)
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
