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
import * as Location from 'expo-location';
import { useCallback } from 'react';
//import myTask from '../services/myTask'
 const numColumns = 14;

export default function DirectMessagesScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)
  const suscriptionAux = useCallback(documentSnapshot => {
         let dataTables = [];  
        if(documentSnapshot.size !== 0) {
          documentSnapshot.forEach(function (doc) { 
              dataTables.push(doc.data())
          })
          console.log('authdata', authData);
         // setAuthData({...authData, hasPayment: value == 'true'})
          setRequestTables(dataTables)
        } else {
          //setAuthData({...authData, requestTables: []})
          
          setRequestTables([])
        }
      }, [authData]) // cada que se actuliza el authDAta se crea nuevamnte la funcion
  
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [userFacility, setUserFacility] = React.useState('');
  const [showText, setShowText] = useState(true);

  const [location, setLocation] = useState(null);
  const [myFacility, setMyFacility] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distancia, setDistancia] = useState(20);
  const [texto, setTexto] = useState('');
  const [inTheClub, setInTheClub] = useState(false);
  const [requestTables, setRequestTables] = useState([]);

  async function _getLocationAsync() {
      let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let lo = await Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 0.5}, function(loc) {
            if (loc ) {
            setLocation(loc);
            // console.log(distance(loc.coords.longitude, loc.coords.latitude, -63.160573 ,-17.629274));
          } 
        })
  }

  useEffect(() => {
     _getLocationAsync()
  }, []);

  

  function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return (d * 1000);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

if(location && !inTheClub && myFacility ) {
  
    let dist = distance(location.coords.longitude, location.coords.latitude, myFacility.longitude , myFacility.latitude);
    if(dist <= distancia) {

     // console.log('CLUBi => ',myFacility.name);
      setTexto(`I'm in ${myFacility.name}`);   
      ChangeStatus(true)
      setInTheClub(true);
      // changeFacility(doc.id);   
      //  setData(JSON.parse(doc.map));       
     // console.log('actulizo estado en la bd de activo'); 
    }
    
  } else {
      //setTexto('fuera de rango');
      
      if(inTheClub) {
        
        let dist = distance(location.coords.longitude, location.coords.latitude, myFacility.longitude , myFacility.latitude);
        if(dist <= distancia) {
         console.log('aun sigo en => ',myFacility.name);   
          
          
        } else {
        //  console.log('me sali de rango');
          setTexto('Out of range');
          ChangeStatus(false);
         // console.log('actulizo estado en la bd de inactivo');
          setInTheClub(false);
          //setAuthData({...authData, facilityData: {}})
        }
      } 
    }

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
   // myTask.register() .then(() => console.log("task Register")).catch(error => console.log(error))
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
    // const doc = await firebase.firestore().collection('facilities').doc(facilityId).get();
    // console.log((doc.data().name));
    // setData(JSON.parse(doc.data().map));

    AsyncStorage.getItem('facilities') .then(function(res) {
      if(res) {
        let data = JSON.parse(res);
        console.log(facilityId);
        var _data = data.data.find(function(post, index) {
            if(post.id == facilityId)
              return true;
        });

        console.log('N-> ', _data.name);
        setMyFacility(_data);
        setData(JSON.parse(_data.map));

      }
    })

    
  }

 
 async function fetchMyAlerts(facilityId) {
   
   // let value = await AsyncStorage.getItem('hasPayment')
    //let value = authData.hasPayment;
 
   let beginningDate = Date.now() - (60 * 60 * 1000)
    let colection = firebase.firestore()
      .collection('interactions')
      .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
      .where("facility", "==", facilityId)
      .where("sent", '==', true)
      .where("date", ">=", beginningDate)
   
    const subscriber = 
      colection
      .onSnapshot(suscriptionAux);
    return () => subscriber();  
  }

  async function ChangeStatus(status) {
    let user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        availability: status,
      })
      .then(() => {
          console.log("availability change successfully!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating availability: ", error);
    
      });
  }
   

  useEffect(()  => {
    async function fetchMyProfile() {
        //setIsLoading(true);
        
       // const doc = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
      //  setUserFacility(doc.data().facility);
    
        fetchMyAPI(authData.profile.facility);
        fetchMyAlerts(authData.profile.facility);
        //setIsLoading(false);
      }
      fetchMyProfile() 
      
  }, [authData.profile.facility]);    

  // useEffect(() => {
     
  //   //getEntertainerFacility();
  //   // Change the state every second or the time given by User.
  //   const interval = setInterval(() => {
  //     setShowText((showText) => !showText);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  function renderItem({item, index}) {
  
    if (item.empty === true || item.type === 'empty') {
      return <View style={[styles.item2, styles.itemInvisible]}/>;
    }
    if (item.type === 'block') {
      return (
        <View style={styles.item2}></View>
      );
    } else {
      if(requestTables.some(el => el.table === parseInt(item.table)) && authData.hasPayment){
        return (
          <TouchableOpacity
            style={[
            styles.item, {
              backgroundColor: showText
                ? theme.colors.primary
                : theme.colors.accent
            }
          ]}
            onPress={() => navigation.navigate('Table', {club: authData.profile.facility, table:item.table})}>
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
     
          <Text style={{color:'white'}}>{texto}</Text> 
      <FlatList
        data={formatData(data, numColumns)}
        extraData={formatData(data, numColumns)}
        style={styles.container}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}/>
      {(requestTables.length > 0 && !authData.hasPayment) ? (<> 
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

