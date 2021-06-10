import React, { useState, useEffect, useContext} from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Paragraph, Dialog, Portal } from 'react-native-paper';
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
import axios from 'axios';
import OverlayLoading from '../components/OverlayLoading';
import moment from "moment"

const STRIPE_PK = 'pk_test_BD6GuOR4VET6XzAtWIXq1yJ0'


const PaymentView = (props) => { 

  const {authData, setAuthData} = useContext(AuthContext)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [fullName, setFullName] = useState();
  const [isLoading,setIsLoading] = useState(false);

  const [visible, setVisible] = React.useState(false);
  const [messageError, setMessageError] = React.useState('');

  const showDialog = () => setVisible(true);

  const hideDialog = () => {setVisible(false); setIsLoading(false);};

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
    let now = moment(new Date()).add(1, 'days'); //todays date  
    //for testing haspayment = false, change later
    setAuthData({...authData, showModalPaySuccess: false,hasPayment: true, showTimer: true, timeTimer: now});
    await AsyncStorage.setItem('hasPayment', 'true'); 
    await AsyncStorage.setItem('timeTimer', now.toISOString()); 
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

    const { name, idCusStripe, amount} = props


    const onCheckStatus = (response) => {
        props.onCheckStatus(response)
    }


    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
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
                width:120px;
                color:white;
                border-radius: 15px;
            }
    </style>
</head>

<body>
    <div class="row">
        <label class="card-errors" id="card-errors"></label>
    </div>
    <p id="payment-result" style="display: none;">
        <!-- we"ll pass the response from the server here -->
    </p>
    <form id="payment-form">
        <div class="card-holder">
            <input type="text" placeholder="Card Holder Name" value="${name}" id="card-name" class="card-name"  style="font-size: 20px"/>
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
            <button class="btn-pay" id="card-button">PAY NOW</button>
        </div>
        
    </form>

    <script>
        var stripe = Stripe("pk_test_BD6GuOR4VET6XzAtWIXq1yJ0");

        var elements = stripe.elements();
        var card = elements.create("card", {
            hidePostalCode: true,
            style: {
                base: {
                    color: "#FFF",
                    fontWeight: 500,
                    fontFamily: "Source Code Pro, Consolas, Menlo, monospace",
                    fontSize: "20px",
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                        color: "#B1B3B5",
                    },
                    ":-webkit-autofill": {
                        color: "#e39f48",
                    },
                },
                invalid: {
                    color: "#FC011F",
                    "::placeholder": {
                        color: "#FFCCA5",
                    },
                },
            }
        });
        // Add an instance of the card Element into the "card-element" <div>.
        card.mount("#card-element");
        /**
         * Error Handling
         */
        //show card error if entered Invalid Card Number
        function showCardError(error) {
            document.getElementById("card-errors").innerHTML = ""
            if (error) {
                document.getElementById("card-errors").innerHTML = error
            }
        }

        card.on("change", function (event) {
            if (event.complete) {
                showCardError()
                // enable payment button
            } else if (event.error) {
                const { message } = event.error
                showCardError(message)
            }
        });

        card.mount("#card-element");

        var form = document.getElementById("payment-form");

        var resultContainer = document.getElementById("payment-result");
        card.on("change", function (event) {
            if (event.error) {
                resultContainer.textContent = event.error.message;
            } else {
                resultContainer.textContent = "";
            }
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            resultContainer.textContent = "";
            stripe.createPaymentMethod({
                type: "card",
                card: card,
            }).then(handlePaymentMethodResult);
        });

        function handlePaymentMethodResult(result) {
            if (result.error) {
                // An error happened when collecting card details, show it in the payment form
                resultContainer.textContent = result.error.message;
            } else {
                window.postMessage(JSON.stringify({loading:true}));
                Paymentintent(result)
            }
        }

        function handleServerResponse(responseJson) {
            if (responseJson.error) {
                // Show error from server on payment form
            } else if (responseJson.requiresAction) {
                // Use Stripe.js to handle required card action
                window.postMessage(JSON.stringify({loading:false, confirmation: true}));
                stripe.handleCardAction(
                    responseJson.data.client_secret
                ).then(function (result) {
                    if (result.error) {

                    } else {
                        //console.log("intent: ", result.paymentIntent);
                        //console.log("clientSecret: ", responseJson.data.id,);
                        window.postMessage(JSON.stringify({loading:true}));
                        confirmPayment(responseJson.data.id, result.paymentIntent)
                    }
                });
            } 
        }

        async function Paymentintent(tok) {
          
            axios({
                method: "POST",
                url: "https://us-central1-test-minx.cloudfunctions.net/createPayment",
                data: {
                    amount: 1000,
                    currency: 'usd',
                    paymentMethod: tok.paymentMethod.id,
                    customerId: "${idCusStripe}",
                    description: "Paid for 24 hrs online"
                },
            }).then(response => {
                console.log('payment',response);
                generateResponse(response.data);
            })
            .catch(error => {
                console.log(error);
                window.postMessage(JSON.stringify(error.data));
            })
        }

        async function confirmPayment(clientSecret, intent) {
            axios({
                method: "POST",
                url: "https://us-central1-test-minx.cloudfunctions.net/confirmPayment",
                data: {
                    paymentMethod: intent.payment_method,
                    clientSecret: clientSecret
                },
            }).then(response => {
                console.log('conform',response.data);
                window.postMessage(JSON.stringify(response.data));

            })
            .catch(error => {
                console.log(error);
            })
        }

        function generateResponse(intent) {
            if (intent.status === "succeeded") {
                // Handle post-payment fulfillment
                window.postMessage(JSON.stringify(intent));
                console.log('paymentIntent', intent);
            } else if (intent.status === "requires_action") {
                // Tell the client to handle the action
                handleServerResponse({ requiresAction: true, data: intent })
            } else {
                // Any other status would be unexpected, so error
                console.log('error', intent);
                window.postMessage(JSON.stringify(intent));
            }
        }
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
        onCheckStatus(data);
        console.log(data);
        let res = JSON.parse(data);
   
        // if(JSON.parse(data).error.code === 'api_key_expired'){
        //       //showModalPaySuccess()
        //       alert('Api key expired');
        // }
        if(!JSON.parse(data).loading && JSON.parse(data).confirmation){
            setIsLoading(false);
        }
        if(JSON.parse(data).loading){
            setIsLoading(true);
        }  
        if(JSON.parse(data).status=== 'requires_payment_method'){
              //showModalPaySuccess()
              
              alert(JSON.parse(data).last_payment_error.message);
              setIsLoading(false);
        }
        if(JSON.parse(data).statusCode=== 402){
              //showModalPaySuccess()
              setIsLoading(false);
              //alert(JSON.parse(data).raw.message);
              setMessageError(JSON.parse(data).raw.message);
              setVisible(true);
              
        }
        if(JSON.parse(data).status=== 'succeeded'){
              //showModalPaySuccess()
              //alert('succeeded');
              setIsLoading(false);
              showModalPaySuccess();
              savePaymentUser(JSON.parse(data));
        }
    }

    function getDataAccount(){
       
        setFullName(`${authData.profile.name} ${authData.profile.lastName}`)
         console.log(fullName);  
    }

    function savePaymentUser(data){
        var user = firebase.auth().currentUser;
        const db = firebase.firestore();
        db.collection("entertainers")
        .doc(user.uid)
        .collection("payments")
        .doc()
        .set(data)
        .then(() => {
            console.log("Payment successfully Saved!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating payment: ", error);
            //setIsLoading(false);
        });
    }

    useEffect(()  => {
      getDataAccount()
      console.log('object', name);
    }, [authData.profile]);

    return (
    <View style={{backgroundColor:'white', height:'100%'}}>    
    <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/> 
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
      <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>{messageError}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
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