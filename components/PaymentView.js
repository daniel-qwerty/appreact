import React, { useState, useEffect, useContext} from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'
import Modal from 'react-native-modal';
import Button from '../components/Botton';
import BigTimer from '../components/BigTimer'
import {IconButton, Surface} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase';
import "firebase/firestore";

const STRIPE_PK = 'pk_test_gkEAGFAdUkkaZtIHSXbW1jCm00aS7wS0PA'


const PaymentView = (props) => { 

  const {authData, setAuthData} = useContext(AuthContext)
  const [showStatusModal, setShowStatusModal] = useState(false);

  const openModalStatus = () => {
    setShowStatusModal(true);
  };

  const closeModalStatus = () => {
    setShowStatusModal(false);
  };

  const changeModalStatus = () => {
    if(authData.available){
        setAuthData({...authData,  available: false})
        changeStatus(false);
    }
        
    else {
        setAuthData({...authData,  available: true})
        changeStatus(true);
    }
       

    setShowStatusModal(false);
  };
  
  

  const showModalPaySuccess = async () => {
    setAuthData({...authData, showModalPaySuccess: true, hasPayment: true, available: true})
  };

  const closeModalPaySuccess = async () => {
    setAuthData({...authData, showModalPaySuccess: false, showTimer: true});
    await AsyncStorage.setItem('hasPayment', 'true'); 
  };

 function changeStatus (status) {
      var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        availability: status,
      })
      .then(() => {
          console.log("Document successfully Saved!");
         
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
    
      });
  }

  function stop(){
    setAuthData({...authData, timer:"stop", });
    console.log("stop");
  };

  function start(){
    setAuthData({...authData, timer:"start", showTimer: true});
    console.log("start");
  };

    const { amount, product} = props


    const onCheckStatus = (response) => {
        props.onCheckStatus(response)
    }


    const htmlContent = `
    
                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Page</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <script src="https://js.stripe.com/v3/"></script>
                <style>
                body { background:${authData.dark ? dark.colors.background : light.colors.background}; color:${authData.dark ? dark.colors.text : light.colors.text}}
                .card-holder{
                    display: flex;
                    flex-direction: column;
                    height: 200px;
                    justify-content: space-around;
                    background-color: 'white';
                    background-image: linear-gradient(to right top, #e40082, #e20181, #e10281, #df0280, #de037f);
                    border-radius: 20px;
                    padding: 10px;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    margin-top: 50px;
                    margin-bottom: 50px;
                     box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                }
                .card-element{
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
                .card-name{
                    padding: 20;
                    color: '#FFF';
                    font-weight: 500;
                    font-size: '25px';
                    background-color: transparent;
                    border: none;
                
                }
                
                input {
                    outline:none;
                    color: #FFF;
                    font-size: '25px';
                    font-weight: 500;
                    background-color: transparent;
                    }
                    
                    .row{
                        margin-top: '50px';
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                    .products-info{
                        
                        height: 150px;
                        width: 100%;
                        padding: 20px;
                        text-align: center;
                    }
                    .card-errors{
                        color: red;
                        margin-top: 30px
                    }
                    .pay-btn{
                        display: flex;
                        height: 50px;
                        justify-content: center;
                        align-items: center;
                        
                    }
                    .btn-pay{
                        background-color:${authData.dark ? dark.colors.primary : light.colors.primary};
                        height: 50px;
                    }
                
                </style>
            
            </head>
            <body>
                
                <!-- product info -->
                <div class="container-fluid">
                    <div class="row">
                        <div class="products-info" style='display:none'>
                            Product Info: ${product}
                            Amount: ${amount}
                        </div>
                    </div>
                    <div class="row">
                        <label class="card-errors" id="card-errors"></label>
                    </div>
            
                        <form id="miForm">
                            <div class="card-holder">
                                    <input type="text" placeholder="Card Holder Name" id="card-name" class="card-name" />
                                    <div id="card-element" class="card-element">
                                        <div class="form-group">
                                            <label for="card_number">Card Number</label>
                                            <input type="text" class="form-control" id="card_number" data-stripe="number">
                                        </div>
                                        <div class="form-row">
                                            <label>
                                                <span>Card number</span>
                                                <input type="text" size="20" data-stripe="number">
                                            </label>
                                        </div> 
                                    
                                        <div class="form-row">
                                        <label>
                                            <span>Expiration (MM/YY)</span>
                                            <input type="text" size="2" data-stripe="exp_month">
                                        </label>
                                        <span> / </span>
                                        <input type="text" size="2" data-stripe="exp_year">
                                        </div>
                                    
                                        <div class="form-row">
                                        <label>
                                            <span>CVC</span>
                                            <input type="text" size="4" data-stripe="cvc">
                                        </label>
                                        </div>
                                    
                                        <div class="form-row">
                                        <label>
                                            <span>Billing Zip</span>
                                            <input type="hidden" size="6" data-stripe="address_zip" value="400012">
                                        </label>
                                        </div>
                                    
                                        
                                    </div>
                                </div>
                            
                                <div class="pay-btn">
                                    <input type="submit" class=" btn-pay " value="Pay Now" />
                                </div>
                
                        </form>
            
                    
                </div>
                
                <script>
                    var stripe = Stripe('${STRIPE_PK}');
                    var elements = stripe.elements();
                   
            
                        var card = elements.create("card", {
                            hidePostalCode: true,
                            style: {
                                base: {
                                color: '#FFF',
                                fontWeight: 500,
                                fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
                                fontSize: '20px',
                                fontSmoothing: 'antialiased',
                                '::placeholder': {
                                    color: '#B1B3B5',
                                },
                                ':-webkit-autofill': {
                                    color: '#e39f48',
                                },
                            },
                            invalid: {
                                color: '#FC011F',
                                '::placeholder': {
                                    color: '#FFCCA5',
                                },
                            },
                            }
                        });
                        // Add an instance of the card Element into the 'card-element' <div>.
                        card.mount('#card-element');
                        /**
                         * Error Handling
                         */
                        //show card error if entered Invalid Card Number
                        function showCardError(error){
                            document.getElementById('card-errors').innerHTML = ""
                            if(error){
                                document.getElementById('card-errors').innerHTML = error
                            } 
                        }
                        
                        card.on('change', function(event) {
                            if (event.complete) {
                                showCardError()
                                // enable payment button
                            } else if (event.error) {
                                const { message} = event.error
                                console.log(message)
                                showCardError(message)
                            }
                        });
                        
                        card.mount('#card-element');
                        
                        /**
                         * Payment Request Element
                         */
                        var paymentRequest = stripe.paymentRequest({
                            country: "IN",
                            currency: "inr",
                            total: {
                                amount: ${amount * 100},
                                label: "Total"
                            }
                        });
                        var form =  document.querySelector('form');
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
            
                            var additionalData = {
                                name: document.getElementById('card-name').value,
                                address_line1: undefined,
                                address_city:  undefined,
                                address_state: undefined,
                                address_zip: undefined,
                            };
            
                            stripe.createToken(card, additionalData).then(function(result) {
                            
                            console.log(result);
                            if (result.token) {
                                window.postMessage(JSON.stringify(result));
                            } else {
                                window.postMessage(JSON.stringify(result));

                                //reset form Credit Card
                                document.querySelector('form').reset();
                                card.clear();
                               
                            }
                        });
                        })
                </script>
            </body>
            </html>
    `;

    const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;


    const onMessage = (event) => {
        const { data } =  event.nativeEvent;
         console.log(data)
        // onCheckStatus(data)
        // if(JSON.parse(data).error.code === 'api_key_expired'){
              showModalPaySuccess()
        // }
    }

    return (
    <View style={{backgroundColor:'white', height:'100%'}}>     
        {authData.hasPayment ? (
          <>
            <View style={authData.dark ? stylesDark.container : styles.container}>
                
                 {authData.available ? (
                    <>
                         <IconButton icon="eye-outline" size={60} color={authData.dark ? dark.colors.text : light.colors.text } style={authData.dark ? stylesDark.iconAvailably : styles.iconAvailably} />
                    </>
                    ) : 
                    <>
                         <IconButton  icon="eye-off-outline" size={60} color={authData.dark ? dark.colors.text : light.colors.text } style={authData.dark ? stylesDark.iconAvailably : styles.iconAvailably} />
                    </>}
                <Surface style={authData.dark ? stylesDark.surface : styles.surface}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
                    {authData.available ? (
                    <>
                        <Text style={authData.dark ? stylesDark.textAvailable : styles.textAvailable}>YOUR STATUS IS: AVAILABLE</Text>
                    </>
                    ) : 
                    <>
                        <Text style={authData.dark ? stylesDark.textAvailable : styles.textAvailable}>YOUR STATUS IS: NOT AVAILABLE</Text>
                    </>}
                </Surface>
                <Button mode="contained" style={authData.dark ? stylesDark.buttonAvailably : styles.buttonAvailably} onPress={openModalStatus}>
                    Change Status
                </Button>
            </View>
          </>
        ) : 
        <>
            <WebView
            javaScriptEnabled={true}
            style={{ flex: 1}}
            originWhitelist={['*']}
            source={{ html: htmlContent}}
            injectedJavaScript={injectedJavaScript}
            onMessage={onMessage}
            />
        </>}
   

    <View style={authData.dark ? stylesDark.containerModal : styles.containerModal}>
        <Modal
          backdropOpacity={0.3}
          isVisible={authData.showModalPaySuccess}
          onBackdropPress={closeModalPaySuccess}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
            <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Payment Successful 👍!</Text>
            <Text style={{color: authData.dark ? dark.colors.text : light.colors.text}}>now you're available for 24 hrs</Text>
            <Button mode="contained" onPress={closeModalPaySuccess} style={authData.dark ? stylesDark.button : styles.button} >
                Ok
            </Button>
          </View>
        </Modal>
        <Modal
          backdropOpacity={0.3}
          isVisible={showStatusModal}
          onBackdropPress={closeModalStatus}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
            <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Status</Text>
            
            {authData.available ? (
            <>
                <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle} >Change your status to not available❓</Text>
            </>
            ) : 
            <>
                <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Change your status to available❓</Text>
            </>}
            <Button mode="contained" onPress={changeModalStatus} style={authData.dark ? stylesDark.button : styles.button} >
                YES
            </Button>
            <Button mode="contained" onPress={closeModalStatus} style={authData.dark ? stylesDark.button : styles.button} >
                NO
            </Button>
          </View>
        </Modal>
      </View>
    </View>
    );
}

 export { PaymentView }

 const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        alignItems     : 'center',
        backgroundColor: dark.colors.background
        
    },
    navigation: {
        flex: 2,
        backgroundColor: 'white'
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
        color: dark.colors.appBarTitleColor,
        fontWeight: 'bold'
    },
    appBarTimer: {
        color: dark.colors.appBarTitleColor,
        textAlign:'right'
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
    
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
        buttonStyle: {
        height: 90,
        width: 90,
        backgroundColor: dark.colors.accent,
        borderRadius: 100
    },
    button: {
        marginTop: 12,
    },
    surface: {
        backgroundColor: dark.colors.primary,
        width: '85%',
        height: 200,
        elevation: 3,
        borderRadius: 15,
        paddingHorizontal:25,
        paddingVertical:55
    },
    buttonAvailably: {
        marginTop: -25,
        width: '50%',
        elevation:6,
        backgroundColor: dark.colors.inputBackground,

    },
    iconAvailably:{
        marginTop:0,
        backgroundColor:dark.colors.inputBackground,
        position:'relative',
        top:50,
        zIndex:7000,
    },
    textAvailable:{
        color:'white',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:30
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems     : 'center',
        backgroundColor: light.colors.background
        
    },
    navigation: {
        flex: 2,
        backgroundColor: 'white'
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
        color: light.colors.appBarTitleColor,
        fontWeight: 'bold'
    },
    appBarTimer: {
        color: light.colors.appBarTitleColor,
        textAlign:'right'
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
    
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
        buttonStyle: {
        height: 90,
        width: 90,
        backgroundColor: light.colors.accent,
        borderRadius: 100
    },
    button: {
        marginTop: 12,
    },
    surface: {
        backgroundColor: light.colors.primary,
        width: '85%',
        height: 200,
        elevation: 3,
        borderRadius: 15,
        paddingHorizontal:25,
        paddingVertical:55
    },
    buttonAvailably: {
        marginTop: -25,
        width: '50%',
        elevation:6,
        backgroundColor: light.colors.inputBackground,

    },
    iconAvailably:{
        marginTop:0,
        backgroundColor:light.colors.inputBackground,
        position:'relative',
        top:50,
        zIndex:7000,
    },
    textAvailable:{
        color:'white',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:30
    }
});