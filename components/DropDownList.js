import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { dark, light } from '../utils/theme';
import AuthContext from '../auth/context'


  export default function DropDownList({...props}) { 

    const {authData, setAuthData} = useContext(AuthContext)
    
    return(
       <DropDownPicker
        style={authData.dark ? stylesDark.input : styles.input}
        dropDownStyle={{backgroundColor: authData.dark ? dark.colors.primary : light.colors.primary}}
        labelStyle={{color: authData.dark ? dark.colors.text : light.colors.text}}
        arrowColor={authData.dark ? dark.colors.primary : light.colors.primary}
        {...props}
      />
    )
      
     
  }

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: light.colors.inputBackground,
    borderTopLeftRadius: 15, borderTopRightRadius: 15,
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
    borderColor: light.colors.primary,
    marginVertical: 5,
    height:40,
    color: light.colors.text
  },
  
});

const stylesDark = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: dark.colors.inputBackground,
    borderTopLeftRadius: 15, borderTopRightRadius: 15,
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
    borderColor: dark.colors.primary,
    marginVertical: 5,
    height:40,
    color: dark.colors.text
  },
  
});

