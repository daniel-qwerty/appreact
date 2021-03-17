import {StatusBar}              from 'expo-status-bar';
import React                    from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'

export default function DirectMessagesScreen({navigation}) {
  return (
   <Background>
  
    <Header>Direct Messages</Header>

    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing.
    </Paragraph>
    
  </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#fff',
    alignItems     : 'center',
    justifyContent : 'center',
  },
});
