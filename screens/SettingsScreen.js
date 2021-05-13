import {StatusBar} from 'expo-status-bar';
import React , {useContext, useState}   from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {IconButton, Surface} from 'react-native-paper';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingsScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);

  async function changeMode() {
    try {
      setIsSwitchOn(!isSwitchOn);
      setAuthData({...authData, dark: !isSwitchOn})
      await AsyncStorage.setItem('darkMode', !isSwitchOn ? 'true' : 'false')
    } catch (e) {
      // saving error
      console.log(e);
    }
    
  }

  function openModalConfig() {
    setShowConfigModal(true);
  };

  function closeModalConfig() {
    setShowConfigModal(false);
  };

  

  var data = [
    {
      "id": 1,
      "name": "My Profile",
      "icon": "account",
      "to": "Profile"
    },
    {
      "id": 2,
      "name": "My Account",
      "icon": "account-box",
      "to": "Account"
    },
    {
      "id": 3,
      "name": "Financial information",
      "icon": "cash-multiple",
      "to": "Billing"
    },
     {
      "id": 4,
      "name": "Change Facility",
      "icon": "swap-horizontal",
      "to": "change"
    }, {
      "id": 5,
      "name": "Logout",
      "icon": "logout",
      "to": "logout"
    }
  ];

  const logOutAuth = async () => {
    await AsyncStorage.removeItem('hasPayment');
    await AsyncStorage.removeItem('facilities');
    firebase.auth().signOut();
    // setAuthData({
    //   ...authData, 
    //   islogged: false,
    // })
  };

  function test() {
     setAuthData({
      ...authData, 
      changeFacility: true
    })
  }

  function renderItem(data) {
    let {item, index} = data;

    return (
       
      <View style={authData.dark ? stylesDark.itemBlock : styles.itemBlock}>
        {
          item.to === 'logout' ? (
            <>
            <TouchableOpacity onPress={logOutAuth}>
               <IconButton icon={item.icon} color='white' size={30}/>
            </TouchableOpacity>
            
            <View style={authData.dark ? stylesDark.itemMeta : styles.itemMeta}>
              <TouchableOpacity  onPress={logOutAuth}>
                <Text style={authData.dark ? stylesDark.itemName : styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            </>
          ) :(

            item.to === 'change' ? (
            <>
            <TouchableOpacity onPress={()=> navigation.navigate('ChangeFacility')}>
               <IconButton icon={item.icon} color='white' size={30}/>
            </TouchableOpacity>
            
            <View style={authData.dark ? stylesDark.itemMeta : styles.itemMeta}>
              <TouchableOpacity  onPress={()=> navigation.navigate('ChangeFacility')}>
                <Text style={authData.dark ? stylesDark.itemName : styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            </>
          ) :(
            
              <>
              <TouchableOpacity onPress={() => navigation.navigate(item.to)}>
                <IconButton icon={item.icon} color='white' size={30}/>
              </TouchableOpacity>
              
              <View style={authData.dark ? stylesDark.itemMeta : styles.itemMeta}>
                <TouchableOpacity  onPress={() => navigation.navigate(item.to)}>
                  <Text style={authData.dark ? stylesDark.itemName : styles.itemName}>{item.name}</Text>
                </TouchableOpacity>
              </View>
              </>
            )
          )
       }
        
      </View>
    )
  }

  function renderSeparator() {
    return <View style={authData.dark ? stylesDark.separator : styles.separator}/>
  }

  return (
    <Background>
      <TouchableOpacity onPress={changeMode} style={authData.dark ? stylesDark.modeButton : styles.modeButton}>
        <IconButton color={authData.dark ? dark.colors.text : light.colors.text} icon="theme-light-dark" size={24}  />
      </TouchableOpacity>
     
      <Logo></Logo>
       
      <Text style={authData.dark ? stylesDark.title : styles.title}>Settings</Text>
      <Surface style={authData.dark ? stylesDark.surface : styles.surface}>
        <FlatList
          style={{}}
          data={data}
          renderItem={renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}/>
      </Surface>
      <Text style={authData.dark ? stylesDark.copyright : styles.copyright}>{`© ${new Date().getFullYear()} Katony, Inc.`}</Text>

      {/* ------MODAL---- */}
      {/* <View style={authData.dark ? stylesDark.containerModal : styles.containerModal}>
       
        <Modal
          backdropOpacity={0.3}
          isVisible={showConfigModal}
          onBackdropPress={closeModalConfig}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
             <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Delete Item ❌</Text>
            <Text style={{color: authData.dark ? dark.colors.text : light.colors.text}}>Are you sure to delete this item?</Text>
            <Button mode="contained" onPress={closeModalConfig} style={authData.dark ? stylesDark.button : styles.button} >
                Ok
            </Button>
          </View>
        </Modal>

       
        
      </View> */}
    

    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  itemBlock: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  itemMeta: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 20,
    color: "white"
  },

  itemLastMessage: {
    fontSize: 14,
    color: "#111"
  },
  surface: {
    backgroundColor: light.colors.primary,
    width: '85%',
    height: 'auto',
    elevation: 6,
    borderRadius: 15
  },
  copyright:{
    marginVertical:20,
    color: light.colors.text,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
    color: light.colors.text,
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
  modeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  }

});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  itemBlock: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  itemMeta: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 20,
    color: "white"
  },

  itemLastMessage: {
    fontSize: 14,
    color: "#111"
  },
  surface: {
    backgroundColor: dark.colors.primary,
    width: '85%',
    height: 'auto',
    elevation: 6,
    borderRadius: 15
  },
  copyright:{
    marginVertical:20,
    color: dark.colors.text,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
    color: dark.colors.text,
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
  modeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  }

});
