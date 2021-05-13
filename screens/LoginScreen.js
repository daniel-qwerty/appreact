import {StatusBar}              from 'expo-status-bar';
import React, {useContext, useState, useEffect}                    from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert} from 'react-native';
import {Snackbar, Dialog, Portal } from 'react-native-paper';
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
import OverlayLoading from '../components/OverlayLoading';
import {dark, light} from '../utils/theme'
import {
  emailValidator,
  passwordValidator,
} from '../utils/utils';

import firebase from 'firebase';
import {saveToCache} from '../utils/utils';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarVisible2, setSnackBarVisible2] = useState(false);
  const [snackBarMessage2, setSnackBarMessage2] = useState('');
  const [scanned, SetScanned] = useState(false);
  const [haveKeychain, SetHaveKeychain] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {authData, setAuthData} = useContext(AuthContext)
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const onDismissSnackBar2 = () => setSnackBarVisible(false);
  
  

  const closeRegisterModal = () => {
    setShowRegisterModal(false)
  }

  function goToRegiterPage(){
    setShowRegisterModal(false)
    navigation.navigate('Register');
  }

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
    setIsLoading(true); 
    await firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(resp =>{
          var user = firebase.auth().currentUser;
          console.log('user', user);
          if (user.emailVerified){
              save('entertainer', JSON.stringify({email: email.value, password: password.value}));
              SetScanned(true);
              setIsLoading(false);
            
              setAuthData({...authData, islogged: true})
          } else {
            firebase.auth().signOut();
            setIsLoading(false);
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
              setIsLoading(false);
              console.log('Weak Password!');
          } else {
              //this.onLoginFailure.bind(this)(errorMessage);
               if (errorCode == 'auth/user-not-found') {
                  console.log(errorCode);
                  setIsLoading(false);
                  setSnackBarMessage2('The user may have been deleted. Please register a new account');
                  setSnackBarVisible2(!snackBarVisible)
                
                  

               } else {
                  console.log(errorCode);
                  setIsLoading(false);
                  setSnackBarMessage(errorMessage);
                  setSnackBarVisible(!snackBarVisible)
               } 
              
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

  async function getFacilities() {
    var all = [];
    await firebase
      .firestore()
      .collection("facilities")
      .get()
      .then(function (querySnapshot) {
        querySnapshot
          .forEach(function (doc) {
            all.push({
              id: doc.id,
              latitude: doc.data().latitude,
              longitude: doc.data().longitude,
              map: doc.data().map,
              name: doc.data().name,
            },)
          });
        console.log('facilities');  
        //await AsyncStorage.getItem('facilities');
        saveToCache('facilities',[...all], 24)
       
      
        //console.log([...all]);
      })
 }


   useEffect(() => {
    checkStoreKeyChain('entertainer');
    getFacilities()
    //  let result =  SecureStore.deleteItemAsync('entertainer');
    //  console.log(result);
  }, []);

  return (
     <Background>
        <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
       <View style={authData.dark ? stylesDark.container : styles.container}>
         <BackButton goBack={() => navigation.navigate('Welcome')} />
      <Logo />
      <Text style={authData.dark ? stylesDark.titleLogin : styles.titleLogin}>Sign In</Text>
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

      <View style={authData.dark ? stylesDark.forgotPassword : styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={authData.dark ? stylesDark.label : styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_checkUser} >
        Login
      </Button>
      {/* <Text style={styles.label}> Or </Text>
      <ButtonsLogin onPress={loginAuth}  /> */}
      <View style={authData.dark ? stylesDark.row : styles.row}>
        <Text style={authData.dark ? stylesDark.label : styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={authData.dark ? stylesDark. link: styles.link}>Sign up</Text>
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

      <Snackbar
        style={{backgroundColor:authData.dark ? dark.colors.primary : light.colors.primary}}
        visible={snackBarVisible2}
        onDismiss={onDismissSnackBar2}
        action={{
          label: 'Register',
          onPress: () => {
            // Do something
            navigation.navigate('Register')
          },
        }}>
        {snackBarMessage2}
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
    color: light.colors.text
  },
  link: {
    fontWeight: 'bold',
    color: light.colors.primary
   
  },
  titleLogin: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14, 
    color: light.colors.text
  }
});

const stylesDark = StyleSheet.create({
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
    color: dark.colors.text
  },
  link: {
    fontWeight: 'bold',
    color: dark.colors.primary
   
  },
  titleLogin: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14, 
    color: dark.colors.text
  }
});
