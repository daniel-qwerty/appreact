import React, {useContext} from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as BackgroundFetch  from 'expo-background-fetch';
import firebase from 'firebase';
import "firebase/firestore";


const TASK_NAME = 'background-location-task';


TaskManager.defineTask(TASK_NAME,() => {

    try {
        const recivenewData = 'My task: ' + Math.random()
   
         let user = firebase.auth().currentUser;
            const db = firebase.firestore();
            db.collection("entertainers")
            .doc(user.uid)
            .update({
                description: 'hola',
            })
            .then(() => {
                console.log("availability change successfully!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating availability: ", error);
            
            });
        console.log(recivenewData);
        return recivenewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData
    } catch (error) {
        return BackgroundFetch.Result.Failed
    }
})

const register = () => {
    return BackgroundFetch.registerTaskAsync( TASK_NAME, {
        minimumInterval: 5
    })
}

const unregister = () => {
    return BackgroundFetch.unregisterTaskAsync(TASK_NAME)
}

export default {
    register,
    unregister
}