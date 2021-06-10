import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import firebase from 'firebase';
import AuthContext from '../auth/context'
import {dark, light} from '../utils/theme'
import {checkToCache, saveToCache} from '../utils/utils'
import defaultData from '../auth/defaultData'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterScreen({navigation}) {

 const {authData, setAuthData} = useContext(AuthContext);

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
        
        
      })
      await saveToCache('facilities',[...all], 24)
 }

 const checkFacilitiesFromChache = async () => {
    try {
    await AsyncStorage.getItem('facilities') .then(async function(result) {
          if(result) {
            
              let data = JSON.parse(result)
              var dateObj = new Date();
              var now = `${dateObj.getUTCFullYear()}-${dateObj.getUTCMonth() + 1}-${dateObj.getUTCDate()}`
              if(now === data.expires){
                console.log('cache valido');
              } else {
                console.log('cache no valido1');
                await AsyncStorage.removeItem('facilities');
              }
          } else {
            console.log('cache no valido2');
                await AsyncStorage.removeItem('facilities');
          }
      })
      .catch(() => {
          console.log('cache no valido3');
      })
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }


  useEffect(() => {
    
    firebase.auth().onAuthStateChanged(async user  => {
      if (user && user.emailVerified) {
          console.log('object1');
          await checkFacilitiesFromChache()
          const profile = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
          setAuthData({...authData, islogged: true, changeFacility: false, profile: profile.data()})
     //   }
      } else {
        console.log('object2');
        await checkFacilitiesFromChache()
        firebase.auth().signOut();
         setAuthData(defaultData)
      }
    });
  }, []);

  return (
    <Background >
      <View style={authData.dark ? stylesDark.container : styles.container}>
        <Logo/>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing.
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.navigate('Login')}>
          Login
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Register')}>
          Sign Up
        </Button>
      </View>

    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
    color: light.colors.text
  }
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
    color: dark.colors.text
  }
});
