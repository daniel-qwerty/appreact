import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {Surface, Appbar, IconButton} from 'react-native-paper';
import { BlurView } from 'expo-blur';
import Background from '../components/Background'
import {theme, dark, light} from '../utils/theme'
import Header from '../components/Header'
//import {map1, map2}  from "../utils/dataMaps/map1";
import AuthContext from '../auth/context'
import Timer from '../components/Timer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase';
import "firebase/firestore";


 const numColumns = 14;

export default function DirectMessagesScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [userFacility, setUserFacility] = React.useState('');
  const [showText, setShowText] = useState(true);

  async function changeMode() {
    try {
      setIsSwitchOn(!isSwitchOn);
      setAuthData({...authData, dark: !isSwitchOn})
     // console.log(JSON.stringify(data));
      await AsyncStorage.setItem('darkMode', !isSwitchOn ? 'true' : 'false')
    } catch (e) {
      // saving error
      console.log(e);
    }
    
  }

  const formatData = (data, numColumns) => {
 
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return data;
  };

  async function fetchMyAPI(facilityId) {
    const doc = await firebase.firestore().collection('facilities').doc(facilityId).get();
    console.log((doc.data().name));
    setData(JSON.parse(doc.data().map));
  }

 
 async function fetchMyAlerts(facilityId) {
   const value = await AsyncStorage.getItem('hasPayment')
   var beginningDate = Date.now() - (60 * 60 * 1000)
    var colection = firebase.firestore()
      .collection('interactions')
      .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
      .where("facility", "==", facilityId)
      .where("sent", '==', true)
      .where("date", ">=", beginningDate)
   
    const subscriber = 
      colection
      .onSnapshot(documentSnapshot => {
         var dataTables = [];  
        if(documentSnapshot.size !== 0) {
          documentSnapshot.forEach(function (doc) { 
              dataTables.push(doc.data())
          })
          
          setAuthData({...authData, requestTables: dataTables, hasPayment: value === 'true' ? true : false})
        } else {
          setAuthData({...authData, requestTables: []})
        }
      });
    return () => subscriber();  
  }


   

  useEffect(()  => {
    async function fetchMyProfile() {
        //setIsLoading(true);
        
        const doc = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
        setUserFacility(doc.data().facility);
        console.log(doc.data().facility);
        fetchMyAPI(doc.data().facility);
        fetchMyAlerts(doc.data().facility);
        //setIsLoading(false);
      }
      fetchMyProfile() 
      
  }, []);    

  useEffect(() => {
     
    //getEntertainerFacility();
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText((showText) => !showText);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function renderItem({item, index}) {
  
    if (item.empty === true || item.type === 'empty') {
      return <View style={[styles.item2, styles.itemInvisible]}/>;
    }
    if (item.type === 'block') {
      return (
        <View style={styles.item2}></View>
      );
    } else {
      if(authData.requestTables.some(el => el.table === parseInt(item.table)) && authData.hasPayment){
        return (
          <TouchableOpacity
            style={[
            styles.item, {
              backgroundColor: showText
                ? theme.colors.primary
                : theme.colors.accent
            }
          ]}
            onPress={() => navigation.navigate('Table', {club: userFacility, table:item.table})}>
            <Text
              style={[
              styles.itemText, {
                backgroundColor: showText
                  ? theme.colors.primary
                  : theme.colors.accent
              }
            ]}>{item.table}</Text>

          </TouchableOpacity>
        );
      } else {
        return (
        <TouchableOpacity
          style={[
          styles.item
        ]}
      >

          <Text
            style={[
            styles.itemText
          ]}>{item.table}</Text>

        </TouchableOpacity>
      );
      }
      
    }
  };

 
  return (
    <Background>
      <Header>
        <Appbar.Content titleStyle={styles.appBarTitle} title="Home" />
        <Appbar.Action icon="" />
        
        {authData.showTimer ? (
          <>
            <Timer></Timer>
          </>
        ) : <></>}
        <Appbar.Action onPress={changeMode} icon="theme-light-dark" />
      </Header>
     
       
      <FlatList
        data={formatData(data, numColumns)}
        extraData={formatData(data, numColumns)}
        style={styles.container}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}/>
      {(authData.requestTables.length > 0 && !authData.hasPayment) ? (<> 
      <BlurView tint={authData.dark ? 'light' : 'dark'} intensity={80} style={[ styles.containerMessageInteraction]}>
        <Text  style={[{color:authData.dark ? 'black' : 'white'},styles.containerMessageInteractionText]}>Do you have Messages</Text>
         <TouchableOpacity style={{backgroundColor: theme.colors.primary, padding:5, marginVertical:5, borderRadius: theme.roundness}} onPress={() => navigation.jumpTo('Start')}>
           <Text style={[{color:'white'}, styles.containerMessageInteractionTextPay]}>Pay Now to read</Text>
         </TouchableOpacity>
      </BlurView> 
      </>) : <></> }  
      
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  item: {
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  item2: {
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,

    height: Dimensions
      .get('window')
      .width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent'
  },
  itemText: {
    color: '#fff',
    backgroundColor: theme.colors.accent,
    fontSize: 10
  },
  appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
   appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign:'right'
  },
  containerMessageInteraction: {
     alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    width:'80%',
    height:200,
  },
  containerMessageInteractionText: {
  
    textAlign: 'center',
    margin: 5
  },
  containerMessageInteractionTextPay: {
    textAlign: 'center',
    margin: 5
  },
 
});


