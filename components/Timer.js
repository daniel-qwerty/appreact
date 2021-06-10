import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import moment from "moment"
import {Surface, Appbar} from 'react-native-paper';
import {theme} from '../utils/theme'
import AuthContext from '../auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Timer = () => {
  const [timeText, setTimeText] = useState(true);
  const {authData, setAuthData} = useContext(AuthContext)


  async function updateTimer() {

    const x = setInterval(async()  => {

      let now = moment(new Date());
      let end = moment(authData.timeTimer); 
      let diffe = end.diff(now, "milliseconds")
      
  
      if (authData.timer === 'stop') {
        clearInterval(x)
      } else {
        if(diffe <= 0) {
          clearInterval(x)
          await AsyncStorage.removeItem('hasPayment');
          await AsyncStorage.removeItem('timeTimer');
          setAuthData({...authData, hasPayment: hasPayments == 'false'})
        } else {
          // let now = moment(new Date()); 
            // let end = moment(authData.timeTimer); // another date
            //console.log('end', authData.timer);
            let duration = moment.duration(end.diff(now));
            //console.log('now',moment.utc(duration.as('milliseconds')).format('HH:mm:ss'));
            //this.setState({days, hours, mins, secs, eventDate})
            setTimeText(`${moment.utc(duration.as('milliseconds')).format('HH:mm:ss')}`);
        }
      }

    }, 1000, [authData])

  }

  useEffect(() => {
   updateTimer()
  }, [authData]);

  return (
    <>
     
      <Appbar.Content
        titleStyle={styles.appBarTimer}
        subtitleStyle={styles.appBarTimer}
        title={`${timeText}`}
        subtitle={authData.available ? 'Available' : 'Not Available'}/>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign: 'right',
    fontSize:12
  }
});