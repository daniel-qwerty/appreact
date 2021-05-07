import React,  {useState, useEffect }                        from 'react';
import {StyleSheet}                from 'react-native';
import {NavigationContainer}       from '@react-navigation/native'
import {createStackNavigator}      from '@react-navigation/stack'
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import LoginScreen                 from "./screens/LoginScreen";
import RegisterScreen              from "./screens/RegisterScreen";
import WelcomeScreen               from "./screens/WelcomeScreen";
import ForgotPassword              from "./screens/ForgotPassword";
import Home                 from "./screens/Home";

import TermsConditionsScreen                 from "./screens/TermsConditionsScreen";
import TermsServicesScreen                 from "./screens/TermsServicesScreen";
import ChatScreen                 from "./screens/ChatScreen";
import AccountScreen  from "./screens/AccountScreen";
import BillingScreen  from "./screens/BillingScreen";
import ProfileScreen  from "./screens/ProfileScreen";
import TableScreen  from "./screens/TableScreen";
import UploadPhotosScreen  from "./screens/UploadPhotosScreen";
import VerificationEmailScreen  from "./screens/VerificationEmailScreen";
import { dark, light, theme } from './utils/theme';
import defaultData from './auth/defaultData'
import AuthContext from './auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase';


const firebaseConfig = {
   apiKey: "AIzaSyDq-cEkNtbGLWRgZ6DlPQ1F4HY03SPi_Lw",
    authDomain: "enterteiner-1322c.firebaseapp.com",
    projectId: "enterteiner-1322c",
    storageBucket: "enterteiner-1322c.appspot.com",
    messagingSenderId: "63643136082",
    appId: "1:63643136082:web:cf7d647f33b9e02c24ef8b"
}
firebase.initializeApp(firebaseConfig);


const Stack = createStackNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authData, setAuthData] = useState(defaultData)
  const [appIsReady, setAppIsReady] = useState(false);

 

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('darkMode')
      setAuthData({...authData, dark: value === 'true'})
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }

  useEffect(()  => {
   
  }, [authData]);

  if(!appIsReady){
    return <AppLoading onError={(e) => {
      setAppIsReady(true)
       
    }} startAsync={getData} onFinish={() => setAppIsReady(true)} />
  }

  return (
    <PaperProvider theme={authData.dark ? dark : light} >
      <AuthContext.Provider value={{authData, setAuthData}}>
        <NavigationContainer theme={authData.dark ? dark : light} >
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
            {
              authData.islogged ? (
                <>
                  <Stack.Screen name="Home" component={Home}/>
                  <Stack.Screen name="TermsConditions" component={TermsConditionsScreen}/>
                  <Stack.Screen name="Account" component={AccountScreen}/>
                  <Stack.Screen name="Chat" component={ChatScreen}/>
                  <Stack.Screen name="Billing" component={BillingScreen}/>
                  <Stack.Screen name="Table" component={TableScreen}/>
                  <Stack.Screen name="Profile" component={ProfileScreen}/>
                  <Stack.Screen name="UploadPhotos" component={UploadPhotosScreen}/>
                </>
              ) : (
                <>
                <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                <Stack.Screen name="TermsService" component={TermsServicesScreen}/>
                <Stack.Screen name="VerificationEmail" component={VerificationEmailScreen}/>
                </>
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
      
    </PaperProvider>
  );
}
export default App

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
});

