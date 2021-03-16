import React,  {useState }                        from 'react';
import {StyleSheet}                from 'react-native';
import {NavigationContainer}       from '@react-navigation/native'
import {createStackNavigator}      from '@react-navigation/stack'
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import LoginScreen                 from "./screens/LoginScreen";
import RegisterScreen              from "./screens/RegisterScreen";
import WelcomeScreen               from "./screens/WelcomeScreen";
import ForgotPassword              from "./screens/ForgotPassword";
import Home                 from "./screens/Home";
import { theme } from './utils/theme';

const Stack = createStackNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(true)

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
          {
            isSignedIn ? (
              <Stack.Screen name="Home" component={Home}/>
            ) : (
              <>
              <Stack.Screen name="Welcome" component={WelcomeScreen}/>
              <Stack.Screen name="Register" component={RegisterScreen}/>
              <Stack.Screen name="Login" component={LoginScreen}/>
              <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
              </>
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
export default App

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
});

