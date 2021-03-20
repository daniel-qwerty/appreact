import React, {memo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BackgroundHome from '../components/BackgroundHome';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TextInputForDate from '../components/TextInputDate';
import {emailValidator, passwordValidator, nameValidator} from '../utils/utils';

export default function AccountScreen({navigation}) {
  const [name,
    setName] = useState({value: 'Barbie', error: ''});
  const [lastName,
    setLastName] = useState({value: '', error: ''});
  const [email,
    setEmail] = useState({value: 'barbie13@gmail.com', error: ''});
  const [phone,
    setPhone] = useState({value: '', error: ''});

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const lastNameError = emailValidator(lastName.value);

    if (emailError || nameError || lastNameError) {
      setName({
        ...name,
        error: nameError
      });
      setName({
        ...lastName,
        error: lastNameError
      });
      setEmail({
        ...email,
        error: emailError
      });
      return;
    }

    //navigation.navigate('Dashboard');
  };

  const [dateBirth,
    setDateBirth] = useState(false);

  const [isDatePickerVisibledDateFrom,
    setDatePickerVisibilityDateFrom] = useState(false);

  const showDatePickerFrom = () => {
    setDatePickerVisibilityDateFrom(true);

  };

  const hideDatePickerFrom = () => {
    setDatePickerVisibilityDateFrom(false);
  };

  const handleConfirmFrom = (date) => {
    const currentDate = date;
    setDateBirth(currentDate);
    hideDatePickerFrom();
  };

  return (
    <BackgroundHome>
      <BackButton goBack={() => navigation.goBack()}/>

      <Header>My Account</Header>

      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({value: text, error: ''})}
        error={!!name.error}
        errorText={name.error}/>

      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={text => setLastName({value: text, error: ''})}
        error={!!lastName.error}
        errorText={lastName.error}/>

      <TextInput label="Phone" returnKeyType="next" value={phone.value}/>

      <TextInputForDate
        label="Date of birth "
        returnKeyType="go"
        value={dateBirth
        ? dateBirth.toLocaleDateString("en-US")
        : ''}
        editable={true}
        onFocus={showDatePickerFrom}/>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"/>

      <DateTimePickerModal
        isVisible={isDatePickerVisibledDateFrom}
        mode="date"
        onConfirm={handleConfirmFrom}
        onCancel={hideDatePickerFrom}/>
      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        Save
      </Button>

    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600'
  },
  button: {
    marginTop: 24
  },
  row: {
    flexDirection: 'row',
    marginTop: 4
  },
  link: {
    fontWeight: 'bold'
  }
});
