import React, { memo, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { emailValidator } from '../utils/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import Button from '../components/Botton';


export default function RegisterScreen({navigation}) {

  const [email, setEmail] = useState({ value: '', error: '' });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate('Login');
  };

  return (
   <Background>
      
      <View style={styles.container}>
       <BackButton goBack={() => navigation.navigate('Login')} />

      <Logo />

      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14,}}>Restore Password</Text>

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
