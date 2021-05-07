import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { IconButton } from 'react-native-paper';
import BackgroundHome from '../components/BackgroundHome';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import TextInputForDate from '../components/TextInputDate';
import {emailValidator, nameValidator,latNameValidator, phoneValidator} from '../utils/utils';
import {Appbar} from 'react-native-paper';
import {dark, light} from '../utils/theme'
import OverlayLoading from '../components/OverlayLoading';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import "firebase/firestore";
import AuthContext from '../auth/context'

export default function AccountScreen({navigation}) {
  const [name,
    setName] = useState({value: '', error: ''});
  const [lastName,
    setLastName] = useState({value: '', error: ''});
  const [email,
    setEmail] = useState({value: '', error: ''});
  const [phone,
    setPhone] = useState({value: '', error: ''});
  const [isLoading,setIsLoading] = useState(false);  

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {authData, setAuthData} = useContext(AuthContext)  

  function openModalDeleteMedia() {
    setShowDeleteModal(true);
    console.log('dasds');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };


  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const lastNameError = latNameValidator(lastName.value);
    const phoneError = phoneValidator(phone.value);
    
    setIsLoading(true);
    if (emailError || nameError || lastNameError || phoneError) {
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
       setPhone({
        ...phone,
        error: phoneError
      });
      setIsLoading(false);
      return;
    }

    //save changes on firestore
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        name: name.value,
        lastName: lastName.value,
        phone: phone.value,
        dateBirth: date,
        updated: Date.now(),
      })
      .then(() => {
          console.log("Document successfully Saved!");
          setIsLoading(false);
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
          setIsLoading(false);
      });

    //navigation.navigate('Dashboard');
  };

  const [dateBirth,
    setDateBirth] = useState(false);

  

  async function fetchMyAPI() {
    setIsLoading(true);
    const doc = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
    console.log(doc.data());
    setName({value: doc.data().name, error: ''})
    setLastName({value: doc.data().lastName, error: ''})
    setEmail({value: doc.data().email, error: ''})
    setPhone({value: doc.data().phone, error: ''})
    setIsLoading(false);
  }

  useEffect(()  => {
    fetchMyAPI()   
  }, []);

  return (
    <BackgroundHome>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
      <BackButton goBack={() => navigation.goBack()}/>

      <Header>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Account" titleStyle={authData.dark ? stylesDark.appBarTitle : styles.appBarTitle}  />
      
      </Header>
    
   <View style={authData.dark ? stylesDark.container : styles.container}>
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

      <TextInput label="Phone"  returnKeyType="next"
        value={phone.value}
        onChangeText={text => setPhone({value: text, error: ''})}
        error={!!phone.error}
        errorText={phone.error}/>

      <View style={{width:'100%'}}> 
        <TextInputForDate
        label="Date of birth "
        returnKeyType="go"
        value={date
        ? date.toLocaleDateString("en-US")
        : ''}
        editable={false}
        />
        <IconButton onPress={() => openModalDeleteMedia()} color={authData.dark ? dark.colors.primary : light.colors.primary} icon="calendar" size={30} style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }} />
      </View>
      

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

   

      <Button mode="contained" onPress={_onSignUpPressed} style={authData.dark ? stylesDark.button : styles.button}>
        Save
      </Button>
       <View style={{height:200, width:'100%'}}>
        <Modal
          backdropOpacity={0.3}
          isVisible={showDeleteModal}
          onBackdropPress={closeDeleteModal}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
             <Text style={styles.contentTitle}>Select Date 📅</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                style={{width:'100%'}}
                textColor={authData.dark ? dark.colors.text : light.colors.text}
              />
              <Button mode="contained" onPress={closeDeleteModal} style={authData.dark ? stylesDark.button : styles.button} >
                  Ok
              </Button>
          </View>
        </Modal>
        
      </View>
     </View>

     

    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
      top:20
    },
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
  },
  appBarTitle: {
    color: light.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: light.colors.modalBackground,
    padding: 15,
    justifyContent:'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: light.colors.text
  },
});

const stylesDark = StyleSheet.create({
  container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
      top:20
    },
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
  },
  appBarTitle: {
    color: dark.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: dark.colors.modalBackground,
    padding: 15,
    justifyContent:'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: dark.colors.text
  },
});
