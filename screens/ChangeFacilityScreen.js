import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import {List, IconButton, Card, Surface, Appbar} from 'react-native-paper';
import { emailValidator } from '../utils/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import Button from '../components/Botton';
import firebase from 'firebase';
import OverlayLoading from '../components/OverlayLoading';
import {dark, light, theme} from '../utils/theme'
import AuthContext from '../auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangeFacilityScreen({navigation}) {

  const [email, setEmail] = useState({ value: '', error: '' });
  const {authData, setAuthData} = useContext(AuthContext)
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const [listData,setListData] = useState([]);

  const onDismissSnackBar = () => setSnackBarVisible(false);

  async function getDataFacilities(){
   
    try {
       
      const value = await AsyncStorage.getItem('facilities')
   
      if(value !== null) {
        let data = JSON.parse(value);
        let listData = []
        data.data.forEach(function (doc) {
            listData.push({label: doc.name, value: doc.id})
        })
        setListData([...listData])
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  function _onSendPressed(value){
   //setAuthData({...authData, islogged: true})
   changeFacility(value)
   navigation.goBack();
  };

  const _onSendPressed2 = () => {
    navigation.goBack()
  };

  function changeFacility (faci) {
      var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        facility: faci,
      })
      .then(() => {
          console.log("Document successfully Saved!");
          setAuthData({...authData, profile: {...authData.profile, facility: faci}})
         
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
    
      });
  }

  useEffect(()  => {
    getDataFacilities()
  }, []);  

  function renderItem({item}) {
    return (
      <View
        style={{
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1,
        
      }}>
        <Surface style={styles.surface}>
           <List.Item
          style={authData.dark ? stylesDark.itemContainer : styles.itemContainer}
          title={item.label}
          // description={item.label}
          onPress={() => _onSendPressed(item.value)}
          right={props => <IconButton icon={authData.profile.facility == item.value ? 'check': 'arrow-right'} color={authData.dark? dark.colors.primary : light.colors.primary} size={30}/>}/>
        </Surface>
       
      </View>

    );
  }
  return (
   <Background>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
      <View style={authData.dark ? stylesDark.container : styles.container}>
       
      <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 12, color: authData.dark ? dark.colors.text : light.colors.text}}>Select Facility</Text>

      <FlatList
        style={{
        height: '100%',
        width: '85%',
        marginHorizontal: 10
      }}
        data={listData}
     
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        zIndex={6000}/>

     

      <Button mode="contained" onPress={_onSendPressed2} style={authData.dark? stylesDark.button : styles.button}>
        CANCEL
      </Button>
      </View>
      

    
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  itemContainer: {
    backgroundColor: theme.colors.background,
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  surface:{
    borderRadius: 25,
    elevation:3,
     width: '100%',
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: 40
  },
  button: {
    marginBottom: 20,
    width: '80%'
  },
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  itemContainer: {
    backgroundColor: dark.colors.background,
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: dark.colors.primary
  },
  surface:{
    borderRadius: 25,
    elevation:3,
     width: '100%',
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: 40
  },
  button: {
    marginBottom: 20,
    width: '80%'
  },
});
