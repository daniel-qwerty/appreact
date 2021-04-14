import {StatusBar}              from 'expo-status-bar';
import React, {useContext, useState, useEffect}                    from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import Logo from '../components/Logo'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Button from '../components/Botton'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import ButtonsLogin from '../components/ButtonsLogin'
import AuthContext from '../auth/context'
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../utils/utils';

import firebase from 'firebase';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
   const [scanned, SetScanned] = useState(false);
   const [haveKeychain, SetHaveKeychain] = useState(false);

  const {authData, setAuthData} = useContext(AuthContext)
  const onDismissSnackBar = () => setSnackBarVisible(false);

  const loginAuth = () => {
    setAuthData({
      ...authData, 
      islogged: true
    })
  };

  const _checkUser = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    signInWithEmail();

    // if(email.value === 'barbie@gmail.com' && password.value === '123456'){
    //   save('entertainer', JSON.stringify({email: email.value, password: password.value}));
    //   SetScanned(true);
    //   loginAuth();
    // } else {
    //   setSnackBarVisible(!snackBarVisible)
    // }
  };

   const signInWithEmail = async() => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(resp =>{
          var user = firebase.auth().currentUser;
          if (user.emailVerified){
              save('entertainer', JSON.stringify({email: email.value, password: password.value}));
              SetScanned(true);
              loginAuth();
          } else {
            firebase.auth().signOut();
            setSnackBarMessage('Your email is not verified, please check your email and validate your email');
            setSnackBarVisible(!snackBarVisible)
          }
        }
      )
      .catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
              //this.onLoginFailure.bind(this)('Weak Password!');
              console.log('Weak Password!');
          } else {
              //this.onLoginFailure.bind(this)(errorMessage);
              console.log(errorMessage);
              setSnackBarMessage(errorMessage);
              setSnackBarVisible(!snackBarVisible)
          }
      });
  }

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function checkStoreKeyChain(key) {
    let result = await SecureStore.getItemAsync(key);
       console.log(result);
    if (result) {
      // alert("🔐 Here's your value 🔐 \n" + result.email);
      SetHaveKeychain(true);
        if(!scanned)
          checkDeviceForHardware();
    } else {
      SetHaveKeychain(false);
      //alert('No credentials of entertainer stored in the keychian, please login manually');
    }
  }

  async function  checkDeviceForHardware() {
    let compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        //alert('Compatible Device!');
        checkForBiometrics();
      }
      else alert('Current device does not have the necessary hardware!')
  }

  async function  checkForBiometrics() {
   let biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
    //alert('No Biometrics Found')
    console.log('No Biometrics Found');
    } 
    else {
    //alert('Biometrics Found')
    if(!scanned)
       handleLoginPress();
    }
  }

  async function handleLoginPress() {
    handleAuthentication();
  };

  async function handleAuthentication() {
     let result = await LocalAuthentication.authenticateAsync();
     if (result.success) {
      //getValueFor('entertainer');
      let data = await SecureStore.getItemAsync('entertainer');
      setEmail({ value: JSON.parse(data).email, error: '' })
      setPassword({ value: JSON.parse(data).password, error: '' })
      console.log(JSON.parse(data).email);
    
     
      // if(haveKeychain){
      //   SetScanned(true);
      //   //loginAuth();
      // }
     }
  };

   useEffect(() => {
    checkStoreKeyChain('entertainer');
  
    //  let result =  SecureStore.deleteItemAsync('entertainer');
    //  console.log(result);
  }, []);

  return (
     <Background>
       <View style={styles.container}>
         <BackButton goBack={() => navigation.navigate('Welcome')} />
      <Logo />
      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14,}}>Enterteiner</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_checkUser} >
        Login
      </Button>
      <Text style={styles.label}> Or </Text>
      <ButtonsLogin onPress={loginAuth}  />
      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

       <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        duration={5000}
        action={{
          label: 'X',
          onPress: () => {
            // Do something
            console.log('object');
          },
        }}>
        {snackBarMessage}
      </Snackbar>
       </View>
      
    </Background>
  );
}

const styles = StyleSheet.create({
    container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
      height:'100%',
    },
    forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    
  },
  link: {
    fontWeight: 'bold',
   
  },
});
