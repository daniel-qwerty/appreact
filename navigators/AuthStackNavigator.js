import 'react-native-gesture-handler';
import * as React from 'react';
import createStackNavigation from '@react-navigation/stack'

import {LoginScreen} from '../screens/LoginScreen'
import {RegisterScreen} from '../screens/RegisterScreen'

const AuthStack = createStackNavigation();

export  function AuthStackNavigator() {
  return (

    <AuthStack.Navigator>
        <AuthStack.Screen name={'Login'} component={LoginScreen} />
        <AuthStack.Screen name={'Register'} component={RegisterScreen} />
    </AuthStack.Navigator>


  );
}


