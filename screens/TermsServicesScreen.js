import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Background from '../components/Background'
import BackButton from '../components/BackButton';
import { WebView } from 'react-native-webview'
import firebase from 'firebase';
import "firebase/firestore";
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'

export default function TermsServicesScreen({navigation}) {

  const [texthtml, setTexthtml] = useState('');
  const {authData, setAuthData} = useContext(AuthContext)

   let getTerms = async () => {
      const doc = await firebase.firestore().collection('configs').doc('legalTexts').get();
      setTexthtml(doc.data().termsOfService);
   }

  useEffect(() => {
    getTerms()
  }, [getTerms]);
  
  return (
    <Background style={{backgroundColor:'white'}} >

      
      
      <View style={authData.dark ? stylesDark.container : styles.container}>
       
        <BackButton goBack={() => navigation.goBack()}/>
        <Text style={{fontSize: 26,fontWeight: 'bold',marginTop: 50, color:authData.dark ? dark.colors.text : light.colors.text}}>Terms of Service</Text>

         <WebView
          style={{height:'100%', width:'100%', flex:1}}
          originWhitelist={['*']}
          source={{ html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-size: '25px'; height:'100%'; background:${authData.dark ? dark.colors.background : light.colors.background}; color:${authData.dark ? dark.colors.text : light.colors.text}}
                </style>
              </head>
              <body>
              ${texthtml}
              </body>
            </html>
          ` }}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    width:'85%',
    height:'100%',
    backgroundColor: light.colors.background
  },
  paragraphText: {
    textAlign: 'left',
    fontSize: 12,
    lineHeight: 26,

    marginBottom: 14
  }
});

const stylesDark = StyleSheet.create({
  container: {
    marginVertical: 50,
    width:'85%',
    height:'100%',
    backgroundColor: dark.colors.background
  },
  paragraphText: {
    textAlign: 'left',
    fontSize: 12,
    lineHeight: 26,

    marginBottom: 14
  }
});
