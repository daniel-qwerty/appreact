import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import {light, dark} from '../utils/theme'
import AuthContext from '../auth/context'

export default function Paragraph({children, Props}) { 

  const {authData, setAuthData} = useContext(AuthContext)
  return(
    <Text style={authData.dark ? stylesDark.text : styles.text}>{children}</Text>
  )
  
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 14,
    color:light.colors.text
  },
});

const stylesDark = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 14,
    color:dark.colors.text
  },
});

