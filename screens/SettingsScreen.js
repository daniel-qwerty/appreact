import {StatusBar} from 'expo-status-bar';
import React , {useContext}   from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {IconButton, Surface} from 'react-native-paper';

import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'
import {theme} from '../utils/theme'
import AuthContext from '../auth/context'

export default function SettingsScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)

  var data = [
    {
      "id": 1,
      "name": "My Account",
      "icon": "account",
      "to": "Account"
    },
    {
      "id": 2,
      "name": "My Billing",
      "icon": "cash-multiple",
      "to": "Billing"
    },
     {
      "id": 3,
      "name": "Help",
      "icon": "lifebuoy",
      "to": "url"
    }, {
      "id": 4,
      "name": "Logout",
      "icon": "logout",
      "to": "logout"
    }
  ];

  const logOutAuth = () => {
    setAuthData({
      ...authData, 
      islogged: false
    })
  };

  function renderItem(data) {
    let {item, index} = data;

    return (
       
      <View style={styles.itemBlock}>
        {
          item.to === 'logout' ? (
            <>
            <TouchableOpacity onPress={logOutAuth}>
               <IconButton icon={item.icon} color='white' size={30}/>
            </TouchableOpacity>
            
            <View style={styles.itemMeta}>
              <TouchableOpacity  onPress={logOutAuth}>
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            </>
          ) :(
            <>
            <TouchableOpacity onPress={() => navigation.navigate(item.to)}>
              <IconButton icon={item.icon} color='white' size={30}/>
            </TouchableOpacity>
            
            <View style={styles.itemMeta}>
              <TouchableOpacity  onPress={() => navigation.navigate(item.to)}>
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            </>
          )
       }
        
      </View>
    )
  }

  function renderSeparator() {
    return <View style={styles.separator}/>
  }

  return (
    <Background>
      <Logo></Logo>
      <Header>Settings</Header>
      <Surface style={styles.surface}>
        <FlatList
          style={{}}
          data={data}
          renderItem={renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}/>
      </Surface>
      <Text style={styles.copyright}>© 2021 Entertainer, Inc.</Text>

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
    color: theme.colors.accent
  },

  itemLastMessage: {
    fontSize: 14,
    color: "#111"
  },
  surface: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    height: 'auto',
    elevation: 6,
    borderRadius: 15
  },
  copyright:{
    marginVertical:20
  }

});
