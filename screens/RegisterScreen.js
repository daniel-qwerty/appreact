import React, { memo, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import ButtonsLogin from '../components/ButtonsLogin'
import AuthContext from '../auth/context'
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../utils/utils';

export default function RegisterScreen({navigation}) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
   const {authData, setAuthData} = useContext(AuthContext)
  
  const RegisterUser = () => {
    setAuthData({
      ...authData, 
      islogged: true
    })
  };

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    RegisterUser();
  };

  return (
    <Background>
      <View style={styles.container}>
        <BackButton goBack={() => navigation.navigate('Welcome')} />

      <Logo/>

      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14,}}>Create Account</Text>

      <TextInput
        label="Name"
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
        keyboardType="default"
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

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        Sign Up
      </Button>
      <Text style={styles.label}> Or </Text>
      <ButtonsLogin onPress={RegisterUser}  />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('TermsService')}>
          <Text style={styles.label}>By signing up you agree to our Terms of Service and Privacy Policy </Text>
        </TouchableOpacity>
      </View>
      </View>
      
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
    },
  label: {
   fontWeight:'600'
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
   
  },      
});
