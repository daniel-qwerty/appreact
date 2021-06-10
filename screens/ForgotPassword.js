import React, { useContext, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {Snackbar } from 'react-native-paper';
import { emailValidator } from '../utils/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import Button from '../components/Botton';
import firebase from 'firebase';
import OverlayLoading from '../components/OverlayLoading';
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'

export default function RegisterScreen({navigation}) {

  const [email, setEmail] = useState({ value: '', error: '' });
  const {authData, setAuthData} = useContext(AuthContext)
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const onDismissSnackBar = () => setSnackBarVisible(false);

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    setIsLoading(true); 
    var auth = firebase.auth();

    // auth.fetchSignInMethodsForEmail(email.value).then(function () {
      
    // })

    auth.sendPasswordResetEmail(email.value).then(function() {
      // Email sent.
      setSnackBarMessage(`We have emailed your password reset link to ${email.value}`);
      setIsLoading(false); 
      setSnackBarVisible(!snackBarVisible)
    }).catch(function(error) {
      // An error happened.
      setIsLoading(false); 
      setSnackBarMessage('There is no user record corresponding to this identifier. The user may have been deleted.');
      setSnackBarVisible(!snackBarVisible)
 
    });

   // navigation.navigate('Login');
  };

  return (
   <Background>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
      <View style={styles.container}>
       <BackButton goBack={() => navigation.navigate('Login')} />

      <Logo />

      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14, color: authData.dark ? dark.colors.text : light.colors.text}}>Restore Password</Text>

      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
        Send Reset Instructions
      </Button>
      </View>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        duration={5000}
        action={{
          label: 'X',
          // onPress: () => {
          //   // Do something
          //   console.log('object');
          // },
        }}>
        {snackBarMessage}
      </Snackbar>

    
    </Background>
  );
}

const styles = StyleSheet.create({
   container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
      height:'100%'
    },
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    width: '100%',
  },      
});
