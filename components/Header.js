import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import {dark, light} from '../utils/theme'
import {Appbar} from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import AuthContext from '../auth/context'


export default function Header({children, props}) {   
  const {authData, setAuthData} = useContext(AuthContext)

  return(
    <Appbar.Header {...props} style={{width:'100%',}}>
      {children}
       <TouchableOpacity onPress={() => { WebBrowser.openBrowserAsync('https://www.myminks.com')}} >
           <Image style={{width:30, height:30, marginRight:5}} source={require('../assets/ButtonIcon.png')} />
       </TouchableOpacity>
    </Appbar.Header>
  )
  
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});
