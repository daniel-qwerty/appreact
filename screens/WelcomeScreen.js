import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'
import firebase from 'firebase';
import AuthContext from '../auth/context'
import {dark, light} from '../utils/theme'
import defaultData from '../auth/defaultData'

export default function RegisterScreen({navigation}) {

 const {authData, setAuthData} = useContext(AuthContext);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user  => {
      console.log('welcomeuser',user);
      if (user && user.emailVerified) {
        console.log('is loggin');
        //console.log(user);
      //  if(authData.changeFacility) {
       //   navigation.navigate('ChangeFacility')
      ///  } else {
          const profile = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
          setAuthData({...authData, islogged: true, changeFacility: false, profile: profile.data()})
     //   }
      } else {
        firebase.auth().signOut();
        console.log('is no loggin');
         setAuthData(defaultData)
       // navigation.navigate('Login');
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
