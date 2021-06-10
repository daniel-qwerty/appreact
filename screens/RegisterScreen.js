import React, { memo, useState, useContext,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {Snackbar } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import ButtonsLogin from '../components/ButtonsLogin'
import AuthContext from '../auth/context'
import OverlayLoading from '../components/OverlayLoading';
import DropDownList from '../components/DropDownList';
import {dark, light} from '../utils/theme'
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  facilityValidator,
} from '../utils/utils';

import firebase from 'firebase';
import "firebase/firestore";
import * as Facebook from 'expo-facebook'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({navigation}) {

  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [facility, setFacility] = useState({ value: '', error: '' });
  const {authData, setAuthData} = useContext(AuthContext)
  const [isLoading,setIsLoading] = useState(false);
  const [facilities,setFacilities] = useState([]);
  
  
  const getDataFacilities = async () => {
    try {
      const value = await AsyncStorage.getItem('facilities')
   
      if(value !== null) {
        let data = JSON.parse(value);
        
        let listData = []
        data.data.forEach(function (doc) {
            listData.push({label: doc.name, value: doc.id})
        })
        setFacilities(listData)
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }
  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const facilityError = facilityValidator(facility.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setFacility({ ...facility, error: facilityError });
      return;
    }

    signUpWithEmail();
  };

   const signUpWithEmail = async() => {
    setIsLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(resp =>{
         var user = firebase.auth().currentUser;
        console.log('user',user);
        user.sendEmailVerification().then(function() {
            const db = firebase.firestore();
            db.collection("entertainers")
              .doc(user.uid)
              .set({
                email: user.email,
                userName: name.value,
                phone: phone.value,
                profileImage: `https://ui-avatars.com/api/?background=FD91B9&color=fff&size=200&name=${name.value}`,
                thumbnail: `https://ui-avatars.com/api/?background=FD91B9&color=fff&size=200&name=${name.value}`,
                created: Date.now(),
                likes: 0,
                dateBirth: null,
                lastName: null,
                name: null,
                facility: facility.value
              }).then(() => {
                  console.log("Profile successfully Saved!");
                  setIsLoading(false);
                  navigation.navigate('VerificationEmail', {email: email.value}) 
                  
              })
              .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error register: ", error);
                  setIsLoading(false);
              });
              
          // setSnackBarMessage(`Your registration has been successful, we send you a verification email to ${email.value}`);
          // setSnackBarVisible(!snackBarVisible)
        }).catch(function(error) {
           
          console.log('error', error);
        });
          
        }
      )
      .catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
              setIsLoading(false);
              setSnackBarMessage('Weak Password!');
              setSnackBarVisible(!snackBarVisible)
          } else {
              //this.onLoginFailure.bind(this)(errorMessage);
              console.log(errorMessage);
              setIsLoading(false);
              setSnackBarMessage(errorMessage);
              setSnackBarVisible(!snackBarVisible)
          }
      });
  }

  const signUpWithFacebook = async() => {
    try {
      setIsLoading(true);
      Facebook.initializeAsync({appId:'1461728394088946'});
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        setIsLoading(false);
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInWithCredential(credential);
        //this.onLoginSuccess.bind(this);
      }
      
    } catch ({message}) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  useEffect(()  => {
    getDataFacilities()
  }, []);  

  return (
    <Background>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
       <ScrollView style={{
        height: '100%', width:'100%', paddingVertical:20}}>
         
      <View style={authData.dark ? stylesDark.container : styles.container}>
        <BackButton goBack={() => navigation.navigate('Welcome')} />
      <Logo/>

      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14, color:authData.dark ? dark.colors.text : light.colors.text}}>Create Account</Text>
     
          <TextInput
        label="User Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

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
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={text => setPhone({ value: text, error: '' })}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        autoCompleteType="tel"
        textContentType="telephoneNumber"
        keyboardType="numbers-and-punctuation"
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

     

      {/* <Text style={authData.dark ? stylesDark.labelDropDown : styles.labelDropDown}>Select your Race</Text> */}
      {/* <DropDownList
        items={facilities}
        placeholder="Select Facility"
        zIndex={8000}
        containerStyle={{
        height: 50,
        width: '100%',
        marginTop: 8
      }}
        defaultValue=''
        onChangeItem={item => setFacility({value: item.value, error: ''})} 
        />
        {facility.error ? <Text style={authData.dark ? stylesDark.error :styles.error}>{facility.error }</Text> : null} */}

      

      <Button mode="contained" onPress={_onSignUpPressed} style={authData.dark ? stylesDark.button : styles.button}>
        Sign Up
      </Button>
      {/* <Text style={styles.label}> Or </Text> */}
      {/* <Button mode="contained" onPress={signUpWithFacebook} style={authData.dark ? stylesDark.button : styles.button}>
        Facebook
      </Button> */}
      {/* <ButtonsLogin  /> */}
      <View style={authData.dark ? stylesDark.row : styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('TermsService')}>
          <Text style={authData.dark ? stylesDark.label : styles.label}>By signing up you agree to our Terms of Service and Privacy Policy </Text>
        </TouchableOpacity>
      </View>
      
      </View>

      </ScrollView>
      
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width:'85%',
    flex:1
  },
  label: {
   fontWeight:'600',
   color: light.colors.text
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom:50
  },
  link: {
    fontWeight: 'bold',
   
  },     
  labelDropDown:{
    color:light.colors.primary,
    textAlign:'left',
    width:'100%',
    paddingHorizontal:12,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    color: light.colors.text
  }, 
});

const stylesDark = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width:'85%',
    flex:1
  },
  label: {
   fontWeight:'600',
   color: dark.colors.text
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom:50
  },
  link: {
    fontWeight: 'bold',
   
  },   
  labelDropDown:{
    color:dark.colors.primary,
    textAlign:'left',
    width:'100%',
    paddingHorizontal:12,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    color: dark.colors.text,
    textAlign:'left',
    width:'100%',
  },   
});
