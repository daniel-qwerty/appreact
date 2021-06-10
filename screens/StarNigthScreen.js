import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import {PaymentView} from '../components/PaymentView'
import {Surface, Appbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import { theme } from "../utils/theme";
import Logo from '../components/Logo'
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'
import Modal from 'react-native-modal';
import AuthContext from '../auth/context'
import Timer from '../components/Timer'
import moment from "moment"

export default function DirectMessagesScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)


  const [response,
    setResponse] = useState()

  const [makePayment,
    setMakePayment] = useState(false)
  const [paymentStatus,
    setPaymentStatus] = useState('')

  const cartInfo = {
    id: '5eruyt35eggr76476236523t3',
    description: 'T Shirt - With react Native Logo',
    amount: 19
  }

  const onCheckStatus = async(paymentResponse) => {
    setPaymentStatus('Please wait while confirming your payment!')
  }

  const paymentUI = () => { < PaymentView style = {{backgroundColor:'red', with:'100%'}}onCheckStatus = {
        onCheckStatus
      }
      name = {
      cartInfo.amount
    }
      
    />
  }

    const [modalVisible, setModalVisible] = useState(true);

    function getDataAccount(){
      if(authData.profile.name == null || authData.profile.lastName == null || authData.profile.idCusStripe == null){
        alert('complete or update your personal data');
        navigation.navigate('Account');
      }
      //console.log(authData.profile);
    }

    useEffect(()  => {
      let now = moment(new Date()); //todays date
      //var now = moment('2021-06-05T01:07:26'); //todays date
      var end2 = moment(new Date()).add(1, 'days'); // another date
      var end = moment('2021-06-10T10:26:19.716Z'); // another date
      var duration = moment.duration(end.diff(now));
      var days = duration.asDays();
      var hours = duration.asHours();
      var min = duration.asMinutes();
      var sec = duration.asSeconds();
    
      // console.log('hours',hours);
      // console.log('min',min);
       console.log('sec',now);
      console.log('now',moment.utc(duration.as('milliseconds')).format('HH:mm:ss'));
      console.log('diference',end.diff(now, "milliseconds"));

      const unsubscribe = navigation.addListener('focus', () => {
      getDataAccount()
    });

    return unsubscribe;

    
      
    }, [authData.profile]);


return (

  <SafeAreaView style={{
    height: '100%'
  }}>
    
    <View style={styles.container}>
      <Header>
        <Appbar.Content titleStyle={styles.appBarTitle} title="Start Night"/>
        <Appbar.Action icon=""/>
       {authData.showTimer ? (
          <>
            <Timer></Timer>
          </>
        ) : <></>}
      </Header>
      <PaymentView
        style={{
        backgroundColor: 'red',
        with: '100%'
      }}
        onCheckStatus={onCheckStatus}
        product={cartInfo.description}
        name={`${authData.profile.lastName} ${authData.profile.name}`}
        idCusStripe={authData.profile.idCusStripe}
        amount={cartInfo.amount}/>


         
    </View>

   

  </SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
  flex: 1
},
navigation: {
  flex: 2,
  backgroundColor: 'red'
},
body: {
  flex: 10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'yellow'
},
footer: {
  flex: 1,
  backgroundColor: 'cyan'
},
appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
   appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign:'right'
  },
   content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
	buttonStyle: {
    height: 90,
    width: 90,
    backgroundColor: theme.colors.accent,
    borderRadius: 100
  }
});
