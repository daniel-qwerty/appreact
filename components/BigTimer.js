import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import AuthContext from '../auth/context'
import moment from "moment"
import {theme} from '../utils/theme'

export default function BigTimer({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)
  const {days, setDays} = 0
  const {hours, setHours} = 0
  const {mins, setMins} = 0
  const {secs, setSecs} = 0
  const {eventDate, setEventDate} = moment.duration().add({days:0,hours:24,minutes:0,seconds:0})

  const updateTimer=()=>{
    
    const x = setInterval(()=>{
      //let { eventDate} = this.state

      if(eventDate <=0){
        clearInterval(x)
      }else {
        //_eventDate = eventDate.subtract(1,"s")
        //moment.duration().add({days:0,hours:24,minutes:0,seconds:0}).subtract(1,"s")
        console.log(eventDate);
    //    // const days = moment.duration().add({days:0,hours:24,minutes:0,seconds:0}).days();
    //     const hours = moment.duration().add({days:0,hours:24,minutes:0,seconds:0}).hours();
    //     const mins = moment.duration().add({days:0,hours:24,minutes:0,seconds:0}).minutes();
    //     const secs = moment.duration().add({days:0,hours:24,minutes:0,seconds:0}).seconds();
    //    // const timer = {...this.state.authData, timer: `${hours} : ${mins} : ${secs}`}

    //   // setDays(days);
    //    setHours(hours);
    //    setMins(mins);
    //    setSecs(secs);
    //    setEventDate(eventDate.subtract(1,"s"));
        
        
      }
    },1000)}

  useEffect(() => {
   updateTimer();
   console.log(moment.duration().add({days:0,hours:24,minutes:0,seconds:0}));
  }, []);


  return (

    <Text>{`${hours} : ${mins} : ${secs}`}</Text>

  );
}
const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginBottom: 12
  }
});
