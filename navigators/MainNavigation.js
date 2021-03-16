import 'react-native-gesture-handler';
import * as React from 'react';
import createStackNavigation from '@react-navigation/stack'

import Home from "./screens/Home";

const AuthStack = createStackNavigation();

export  function MainNavigator() {
  return (

    <MainNavigator.Navigator>
          <Stack.Screen name="Home" component={Home}/>
    </MainNavigator.Navigator>


  );
}


