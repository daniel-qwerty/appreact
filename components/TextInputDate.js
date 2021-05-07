import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, IconButton } from 'react-native-paper';
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'


// type Props = React.ComponentProps<typeof Input> & { errorText?: string };


export default function TextInputForDate({errorText, ...props}) { 

  const {authData, setAuthData} = useContext(AuthContext)
  
  return(
    <View style={authData.dark ? stylesDarks.container : styles.container}>
      <Input
        style={authData.dark ? stylesDarks.input : styles.input}
        underlineColor="transparent"
        mode="outlined"
        theme={{ colors: {text:authData.dark ? dark.colors.text : light.colors.text, placeholder:authData.dark ? dark.colors.primary : light.colors.primary} }}   
        {...props}
      />
      
      
      {errorText ? <Text style={authData.dark ? stylesDarks.error : styles.error}>{errorText}</Text> : null}
    </View>
  )
  
}  

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: light.colors.inputBackground,
    height:40,
    paddingRight: 50,
    color:'white'
   
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    color: light.colors.text
  },
});

const stylesDarks = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: dark.colors.inputBackground,
    height:40,
    paddingRight: 50,
    color:'white'
   
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    color: dark.colors.text
  },
});

