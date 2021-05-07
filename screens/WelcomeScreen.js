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

export default function RegisterScreen({navigation}) {

 const {authData, setAuthData} = useContext(AuthContext);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        //console.log(user);
        setAuthData({...authData, islogged: true})
      } else {
        navigation.navigate('Login');
      }
    });
  }, []);

  return (
    <Background >
      <View style={authData.dark ? stylesDark.container : styles.container}>
        <Logo/>
        <Text style={authData.dark ? stylesDark.title : styles.title}>Entertainer</Text>
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
