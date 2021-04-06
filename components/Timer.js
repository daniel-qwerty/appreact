import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import moment from "moment"
import {Surface, Appbar} from 'react-native-paper';
import {theme} from '../utils/theme'

export default class Timer extends React.Component {

  state={
    eventDate:moment.duration().add({days:0,hours:24,minutes:0,seconds:0}), // add 9 full days
    days:0,
    hours:0,
    mins:0,
    secs:0
  }

  componentDidMount(){
    this.updateTimer()
  }
  updateTimer=()=>{
    
    const x = setInterval(()=>{
      let { eventDate} = this.state

      if(eventDate <=0){
        clearInterval(x)
      }else {
        eventDate = eventDate.subtract(1,"s")
        const days = eventDate.days()
        const hours = eventDate.hours()
        const mins = eventDate.minutes()
        const secs = eventDate.seconds()
        
        this.setState({
          days,
          hours,
          mins,
          secs,
          eventDate
        })
      }
    },1000)

  }
  render(){
    const { days, hours, mins, secs } = this.state
    return (
  
        <Appbar.Content titleStyle={styles.appBarTimer} subtitleStyle={styles.appBarTimer} title={`${hours} : ${mins} : ${secs}`} subtitle="Availably"/>
        // <Text>{`${days} : ${hours} : ${mins} : ${secs}`}</Text>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign:'right'
  },
});