import React                       from 'react';
import {StyleSheet}                from 'react-native';
import {NavigationContainer}       from '@react-navigation/native'
import {createStackNavigator}      from '@react-navigation/stack'
import {Provider as PaperProvider} from 'react-native-paper';
import LoginScreen                 from "./screens/LoginScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={LoginScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
export default App

const styles = StyleSheet.create({
                                   container: {
                                     flex           : 1,
                                     backgroundColor: '#fff',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                   },
                                 });

