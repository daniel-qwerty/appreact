import {StatusBar}              from 'expo-status-bar';
import React                    from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';


import Logo from '../components/Logo'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Button from '../components/Botton'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import ButtonsLogin from '../components/ButtonsLogin'

export default function LoginScreen({ navigation }) {
    
  

  return (
     <Background>
      <BackButton goBack={() => navigation.navigate('Welcome')} />
      <Logo />
      <Header>Enterteiner</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value=""
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value=""
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={() => navigation.navigate('Home')} >
        Login
      </Button>
      <Text style={styles.label}> Or </Text>
      <ButtonsLogin goBack={() => navigation.navigate('Home')}/>
      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
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
