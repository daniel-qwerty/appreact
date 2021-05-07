import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import Header from '../components/Header';
import {Appbar, IconButton, Button as PaperButton } from 'react-native-paper';
import {theme} from '../utils/theme'
import BackgroundHome from '../components/Background';
import OverlayLoading from '../components/OverlayLoading';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import "firebase/firestore";
import AuthContext from '../auth/context'


export default function TableScreen({route, navigation}) {

  /* 2. Get the param */
  const {club, table, seat} = route.params;
  const [height,setHeight] = useState(Dimensions.get('window').height);
  const [width,setWidth] = useState(Dimensions.get('window').width);
  const [isLoading,setIsLoading] = useState(false);
  const [messages,setMessages] = useState([]);
  const [showAnswerModal,setShowAnswerModal] = useState(false);
  const {authData, setAuthData} = useContext(AuthContext)

  var asnwers = [ "Hello!", "Thank you", "I'm going to your table", "Sure", "Another option", ];

  const openModalAnswer = () => {
    setShowAnswerModal(true);
  };

  const closeAnswerModal = () => {
    setShowAnswerModal(false);
  };


 function sendAnswer(message) {
    const db = firebase.firestore();
    db.collection("interactions")
      .doc()
      .set({
        date: Date.now(),
        entertainer: firebase.auth().currentUser.uid.toString(),
        facility: club,
        msg: message,
        sent: false,
        table: parseInt(table),
        type: 'message'
      })
      .then(() => {
          console.log("Answer sended");
          setIsLoading(false);
          closeAnswerModal()
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error send answer: ", error);
          setIsLoading(false);
      });

  }    
  
  useEffect(() => {
    var all = [];
    var beginningDate = Date.now() - (60 * 60 * 1000)
    var colection = firebase.firestore()
      .collection('interactions')
      .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
      .where("facility", "==", club)
      .where("table", '==', parseInt(table))
      .where("date", ">=", beginningDate)
      .orderBy("date")
    const subscriber = 
      colection
      .onSnapshot(documentSnapshot => {
        all = [];
        documentSnapshot
        .forEach(function (doc) {            
            all.push({
              id: doc.id,
              sent: doc.data().sent,
              msg: doc.data().msg,
              type: doc.data().type,
            },)
          });
          setMessages([...all]);
      });
    return () => subscriber();  
  }, []);

  function renderItem({item}) {
    if (item.sent === false) {
      return (
        <View style={styles.eachMsg}>
         
          <View style={styles.msgBlock}>
            <Text style={styles.msgTxt}>{item.msg}</Text>
          </View>
        </View>
      );
    } else {
      if(item.type !== 'message') {
          return (
            <View style={styles.rightMsg}>
              <View style={styles.rightBlockLike}>
                <IconButton color={theme.colors.likeMessageColor} icon="hand-heart" size={30} />
              </View>
            </View>
          );
      } else {
         return (
            <View style={styles.rightMsg}>
              <View style={styles.rightBlock}>
                <Text style={styles.rightTxt}>{item.msg}</Text>
              </View>
            </View>
          );
      }
      
    }
  };    

  return (
    <BackgroundHome style={styles.container}>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
      <Header>
        <Appbar.BackAction color='white' onPress={() => navigation.goBack()}/>
        <Appbar.Content titleStyle={styles.appBarTitle} title={`Table ${table}`}/>
      </Header>
      <View style={{
          flex: 1,
          width:'100%'
        }}>

           <FlatList
              extraData={messages}
              data={messages}
              keyExtractor=
              {(item) => { return item.id; }}
              renderItem={renderItem}/>

               <PaperButton
                style={{backgroundColor:theme.colors.primary, borderRadius:0, height:50, padding:5}}
                labelStyle={{color: 'white'}} onPress={openModalAnswer}>
                Answer
              </PaperButton>

              
        </View>

      
       

        <Modal
          backdropOpacity={0.3}
          isVisible={showAnswerModal}
          onBackdropPress={closeAnswerModal}
          style={styles.contentView}
        >
          <View style={styles.content}>
             <Text style={styles.contentTitle}>Select your answer</Text>
             { asnwers.map((item, key)=>(
                <PaperButton
                  key={key} 
                  style={{ borderRadius:0, height:50, padding:5}}
                  labelStyle={{color: theme.colors.primary}} 
                  onPress={() => sendAnswer(item)}
                  >
                  { item }
                </PaperButton>
              ))}
           
          </View>
        </Modal>
        

      
    </BackgroundHome>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
  image: {
    
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  right: {
    flexDirection: 'row'
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5
  },
  
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end'
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8'
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1
    }
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
    padding: 10,
    shadowColor: '#191a21',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1
    }
  },
  rightBlockLike: {
    width: 50,
    borderRadius: 5,

  
   
  },
  msgTxt: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600'
  },
  rightTxt: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600'
  },

  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: theme.colors.modalBackground,
    padding: 15,
    justifyContent:'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: theme.colors.text
  },
});
