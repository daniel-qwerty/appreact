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
    amount: 1
  }

  const onCheckStatus = async(paymentResponse) => {
    setPaymentStatus('Please wait while confirming your payment!')
    // setResponse(paymentResponse) let jsonResponse = JSON.parse(paymentResponse);
    // perform operation to check payment status try {     const stripeResponse =
    // await axios.post('http://localhost:8000/payment', {         email:
    // 'codergogoi@gmail.com',         product: cartInfo,         authToken:
    // jsonResponse     })     if(stripeResponse){         const { paid } =
    // stripeResponse.data;         if(paid === true){ setPaymentStatus('Payment
    // Success')         }else{ setPaymentStatus('Payment failed due to some issue')
    //         }     }else{     setPaymentStatus(' Payment failed due to some
    // issue')     } } catch (error) {     console.log(error)     setPaymentStatus('
    // Payment failed due to some issue') }

  }

  const paymentUI = () => { < PaymentView style = {{backgroundColor:'red', with:'100%'}}onCheckStatus = {
      onCheckStatus
    }
    product = {
      cartInfo.description
    }
    amount = {
      cartInfo.amount
    } />
}

const [modalVisible, setModalVisible] = useState(true);


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
