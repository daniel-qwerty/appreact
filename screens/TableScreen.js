import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import {theme} from "../utils/theme";
import {Appbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'

import Chat from "../screens/ChatScreen";

export default function TableScreen({route, navigation}) {

  /* 2. Get the param */
  const {club, table, seat} = route.params;

  return (
    <SafeAreaView style={{
      height: '100%'
    }}>
      
      <View style={styles.container}>
     
        <View style={styles.header}>
             <BackButton  goBack={() => navigation.goBack()}/>
        </View>
        <Image
          style={styles.avatar}
          source={{
          uri: 'https://www.bootdey.com/img/Content/avatar/avatar1.png'
        }}/>
        
        <View style={styles.body}>
            <Text style={styles.name}>John Doe</Text>
            {/* <Text style={styles.description}>{club}</Text> */}
            <Text style={styles.info}>TABLE: {table}</Text>
          
        </View>
         <Chat/>

       
      </View>
      

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    height: 150,
    paddingHorizontal:20
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 60,
    
  },
  
  body: {
    marginTop: 60,
    alignItems: 'center',
    height:90
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  name: {
    fontSize: 28,
    height: 30,
    color: "#696969",
    fontWeight: "600",
    marginBottom:5
  },
  info: {
    fontSize: 16,
    height: 30,
    color: theme.colors.accent,
    marginTop: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    height: 30,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  container: {
    backgroundColor: 'white',
    height: '100%'
  }
});
