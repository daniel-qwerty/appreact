import {StatusBar}              from 'expo-status-bar';
import React                    from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'

export default function RegisterScreen({navigation}) {
  return (
   <Background >
     <View style={styles.container}>
<Logo />
    <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14,}}>Enterteiner</Text>

    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing.
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('Login')}>
      Login
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('Register')}
    >
      Sign Up
    </Button>
     </View>
    
  </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#fff',
    alignItems     : 'center',
    justifyContent : 'center',
    width:'85%'
  },
});
