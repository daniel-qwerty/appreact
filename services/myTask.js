import React, {useContext} from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as BackgroundFetch  from 'expo-background-fetch';
import firebase from 'firebase';
import "firebase/firestore";
import axios from "axios"

const TASK_NAME = 'background-location-task';


TaskManager.defineTask(TASK_NAME,() => {

    try {
        const recivenewData = 'My task: ' + Math.random()
   
        axios({
        method: 'POST',
        url: "https://us-central1-test-minx.cloudfunctions.net/test",
        data:{
          lat: 'id',
          lon: 'asdas',
        }
    }).then(response => {
        // console.log(response.data);
        console.log('customer stripe actualizado');
        return true
    })
    .catch(error => {
        console.log(error.response);
        console.log('customer stripe no actualizado');
        return false
    })
        console.log(recivenewData);
        return recivenewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData
    } catch (error) {
        return BackgroundFetch.Result.Failed
    }
})

const register = () => {
    return BackgroundFetch.registerTaskAsync( TASK_NAME, {
        minimumInterval: 40
    })
}

const unregister = () => {
    return BackgroundFetch.unregisterTaskAsync(TASK_NAME)
}

export default {
    register,
    unregister
}