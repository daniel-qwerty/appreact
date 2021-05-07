import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { dark, light } from '../utils/theme';
import AuthContext from '../auth/context'

 export default function Background({mode, style, children, ...props }) { 

  const {authData, setAuthData} = useContext(AuthContext)

  return(
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' ,
        style,
      ]}
      labelStyle={authData.dark? stylesDark.text : styles.text}
      mode={mode}
      {...props}
    >
      {children}
    </PaperButton>
  )
  
 }

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color: light.colors.text
  },
});

const stylesDark = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color: dark.colors.text
  },
});

