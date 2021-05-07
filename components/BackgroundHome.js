import React, {useContext} from 'react';
import {ImageBackground, StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { dark, light } from '../utils/theme';
import AuthContext from '../auth/context';


  export default function BackgroundHome({children, Props}) { 

  const {authData, setAuthData} = useContext(AuthContext)
    return(
      <ImageBackground
        // source={require('../assets/images/background_dot.png')}
        resizeMode="repeat"
        style={authData.dark ? stylesDark.background : styles.background}>
        <SafeAreaView style={{
          height: '100%'
        }}>
          <ScrollView style={{
            height: '100%'
          }}>
            <KeyboardAvoidingView style={authData.dark ? stylesDark.container : styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

              {children}

            </KeyboardAvoidingView>
          </ScrollView>

        </SafeAreaView>
      </ImageBackground>
    )
  }

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: light.colors.background
  },
  container: {
    flex: 1,
    padding: 0,
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const stylesDark = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: dark.colors.background
  },
  container: {
    flex: 1,
    padding: 0,
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
