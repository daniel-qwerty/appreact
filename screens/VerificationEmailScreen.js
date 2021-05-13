import React, { memo, useState, useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { emailValidator } from '../utils/utils';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Botton';
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'


export default function VerificationEmailScreen({route, navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)

  /* 2. Get the param */
  const {email} = route.params;

  const _onSendPressed = () => {
    navigation.navigate('Login');
  };

  return (
   <Background>
      
      <View style={styles.container}>

      <Logo />

      <Text style={{fontSize: 16,fontWeight: 'bold',paddingVertical: 14, color:authData.dark ? dark.colors.text : light.colors.text}}>
          {`Your registration has been successful, we send you a verification email to ${email} for activating your account`}
      </Text>

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
        Go to Login
      </Button>
      </View>
      

    
    </Background>
  );
}

const styles = StyleSheet.create({
   container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
      height:'100%'
    },
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    width: '100%',
  },      
});
