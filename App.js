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
import ChangeFacilityScreen  from "./screens/ChangeFacilityScreen";
import UploadPhotosScreen  from "./screens/UploadPhotosScreen";
import VerificationEmailScreen  from "./screens/VerificationEmailScreen";
import { dark, light, theme } from './utils/theme';
import defaultData from './auth/defaultData'
import AuthContext from './auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase';
import {saveToCache} from './utils/utils';
import * as Location from 'expo-location';

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
  const [authData, setAuthData] = useState(defaultData)
  console.log('authdata APP', authData);
  const [appIsReady, setAppIsReady] = useState(false);

 async function getFacilities() {
    var all = [];
    await firebase
      .firestore()
      .collection("facilities")
      .get()
      .then(function (querySnapshot) {
        querySnapshot
          .forEach(function (doc) {
            all.push({
              id: doc.id,
              latitude: doc.data().latitude,
              longitude: doc.data().longitude,
              map: doc.data().map,
              name: doc.data().name,
            },)
          });
        console.log('facilities');  
        //await AsyncStorage.getItem('facilities');
        saveToCache('facilities',[...all], 24)
       
      
        //console.log([...all]);
      })
 }

//  async function getGeoData() {
//      let { status } = await Location.requestPermissionsAsync();
//         if (status !== 'granted') {
//           setErrorMsg('Permission to access location was denied');
//           return;
//         }
//         try {
//            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
//            console.log(location);
//         let geoCode = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude })
//         //let geoCode = await Location.reverseGeocodeAsync({latitude: 34.137015, longitude: -118.200840 })
//         console.log(geoCode);
//         } catch (error) {
//           console.log(error);
//         }
       
//  }

  const getData = async () => {
    try {
     await AsyncStorage.getItem('facilities') .then(function(resultado) {
          if(resultado) {
              console.log('hayCache');
          } else {
            console.log('No hay');
            getFacilities();
          }  
      })
      .catch(() => {
          console.log('No hay');
          getFacilities();
      })
      const value = await AsyncStorage.getItem('darkMode')
      const hasPayments = await AsyncStorage.getItem('hasPayment')
      
      setAuthData({...authData, dark: value === 'true', hasPayment: hasPayments == 'true'})
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }

  // useEffect(()  => {
   
  // }, [authData]);

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
                  <Stack.Screen name="ChangeFacility" component={ChangeFacilityScreen}/>
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

