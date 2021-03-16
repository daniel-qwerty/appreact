import 'react-native-gesture-handler';
import * as React from 'react';
import createStackNavigation from '@react-navigation/stack'

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import ForgotPassword from "./screens/ForgotPassword";

const AuthStack = createStackNavigation();

export  function AuthStackNavigator() {
  return (

    <AuthStack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
          <Stack.Screen name="Home" component={Home}/>
    </AuthStack.Navigator>


  );
}


