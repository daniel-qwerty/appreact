import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import NavigatorContainer from '@react-navigation/native'
import createStackNavigation from '@react-navigation/stack'

import { Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';

import {AuthStackNavigator} from './navigators/AuthStackNavigator'



const RootStack = createStackNavigation();

export default function Main() {
  return (
    <PaperProvider >
      <NavigatorContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false}}>
          <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
        </RootStack.Navigator>
      </NavigatorContainer>
    </PaperProvider>
  );
}
AppRegistry.registerComponent(appName, () => Main);


