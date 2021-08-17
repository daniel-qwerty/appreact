import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Button,
  Platform,
} from "react-native";
import { Surface, Appbar, IconButton } from "react-native-paper";
import { BlurView } from "expo-blur";
import Background from "../components/Background";
import { theme, dark, light } from "../utils/theme";
import { getDistance, saveToCache } from "../utils/utils";
import Header from "../components/Header";
//import {map1, map2}  from "../utils/dataMaps/map1";
import AuthContext from "../auth/context";
import Timer from "../components/Timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";
import "firebase/firestore";
import * as Location from "expo-location";
import { useCallback } from "react";
import myTask from "../services/myTask";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import axios from "axios";

const numColumns = 14;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function DirectMessagesScreen({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { authData, setAuthData } = useContext(AuthContext);
  const suscriptionAux = useCallback(
    (documentSnapshot) => {
      let dataTables = [];
      if (documentSnapshot.size !== 0) {
        documentSnapshot.forEach(function (doc) {
          dataTables.push(doc.data());
        });
        //  console.log('authdata', authData);
        // setAuthData({...authData, hasPayment: value == 'true'})
        setRequestTables(dataTables);
      } else {
        //setAuthData({...authData, requestTables: []})

        setRequestTables([]);
      }
    },
    [authData]
  ); // cada que se actuliza el authDAta se crea nuevamnte la funcion

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [userFacility, setUserFacility] = React.useState("");
  const [showText, setShowText] = useState(true);

  const [location, setLocation] = useState(null);
  const [myFacility, setMyFacility] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distancia, setDistancia] = useState(3220);
  const [texto, setTexto] = useState("");
  const [clubId, setClubId] = useState(null);
  const [inTheClub, setInTheClub] = useState(false);
  const [requestTables, setRequestTables] = useState([]);
  const [facilitiesPulled, setFacilitiesPulled] = useState(false);
  const [textFindFacility, setTextFindFacility] = useState(false);

  async function _getLocationAsync() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let lo = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 0.5 },
      function (loc) {
        if (loc) {
          setLocation(loc);

          // console.log(distance(loc.coords.longitude, loc.coords.latitude, -63.160573 ,-17.629274));
        }
      }
    );
  }

  useEffect(() => {
    _getLocationAsync();
  }, []);

  async function getFacilitiesFromCache() {
    await AsyncStorage.getItem("facilities")
      .then(function (result) {
        if (result) {
          let data = JSON.parse(result);
          console.log("hayCache");
          data.data.forEach((element) => {
            let dist = getDistance(
              location.coords.longitude,
              location.coords.latitude,
              element.longitude,
              element.latitude
            );
            if (dist <= distancia) {
              setMyFacility(element);
              setData(JSON.parse(element.map));
              fetchMyAlerts(element.id);
              setClubId(element.id);
              setFacilitiesPulled(true);
              return false;
            }
          });
        } else {
          getFacilities();
        }
      })
      .catch((error) => {
        console.log(error);
        getFacilities();
      });
  }

  async function getFacilities() {
    var all = [];
    await firebase
      .firestore()
      .collection("facilities")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          all.push({
            id: doc.id,
            latitude: doc.data().latitude,
            longitude: doc.data().longitude,
            map: doc.data().map,
            name: doc.data().name,
          });
        });
        //await AsyncStorage.getItem('facilities');

        saveToCache("facilities", [...all], 24);
        getFacilitiesFromCache();
      });
  }
  if (location && !facilitiesPulled) {
    getFacilitiesFromCache();
  }

  if (location && !inTheClub && myFacility) {
    let dist = getDistance(
      location.coords.longitude,
      location.coords.latitude,
      myFacility.longitude,
      myFacility.latitude
    );
    if (dist <= distancia) {
      // console.log('CLUBi => ',myFacility.name);
      setTexto(`I'm in ${myFacility.name}`);
      ChangeStatus(true, myFacility.id);
      setInTheClub(true);
      setTextFindFacility(false);
      // changeFacility(doc.id);
      //  setData(JSON.parse(doc.map));
      // console.log('actulizo estado en la bd de activo');
    }
  } else {
    //setTexto('fuera de rango');

    if (inTheClub) {
      let dist = getDistance(
        location.coords.longitude,
        location.coords.latitude,
        myFacility.longitude,
        myFacility.latitude
      );
      if (dist <= distancia) {
        console.log("aun sigo en => ", myFacility.name);
      } else {
        setTexto("Out of range");
        setTextFindFacility(true);
        setFacilitiesPulled(false);
        ChangeStatus(false, "");
        setData([]);
        // console.log('actulizo estado en la bd de inactivo');
        setInTheClub(false);
      }
    }
  }

  async function changeMode() {
    try {
      setIsSwitchOn(!isSwitchOn);
      setAuthData({ ...authData, dark: !isSwitchOn });
      await AsyncStorage.setItem("darkMode", !isSwitchOn ? "true" : "false");
    } catch (e) {
      // saving error
      console.log(e);
    }
    //myTask.register() .then(() => console.log("task Register")).catch(error => console.log(error))
  }

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  async function fetchMyAPI(facilityId) {
    AsyncStorage.getItem("facilities").then(function (res) {
      if (res) {
        let data = JSON.parse(res);
        var _data = data.data.find(function (post, index) {
          if (post.id == facilityId) return true;
        });
        setMyFacility(_data);
        setData(JSON.parse(_data.map));
      }
    });
  }

  async function fetchMyAlerts(facilityId) {
    // let value = await AsyncStorage.getItem('hasPayment')
    //let value = authData.hasPayment;

    let beginningDate = Date.now() - 60 * 60 * 1000;
    let colection = firebase
      .firestore()
      .collection("interactions")
      .where("entertainer", "==", firebase.auth().currentUser.uid.toString())
      .where("facility", "==", facilityId)
      .where("sent", "==", true)
      .where("date", ">=", beginningDate);

    const subscriber = colection.onSnapshot(suscriptionAux);
    return () => subscriber();
  }

  async function ChangeStatus(status, facility) {
    let user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        availability: status,
        facility: facility,
      })
      .then(() => {
        console.log("availability change successfully!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating availability: ", error);
      });
  }

  async function savePushNotifToken(token) {
    let user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        pushToken: token,
      })
      .then(() => {
        console.log("push token save successfully!");
      })
      .catch((error) => {
        console.error("Error save push token: ", error);
      });
  }

  useEffect(() => {
    async function fetchMyProfile() {
      //setIsLoading(true);
      // const doc = await firebase.firestore().collection('entertainers').doc(firebase.auth().currentUser.uid).get();
      //  setUserFacility(doc.data().facility);
      //  fetchMyAPI(authData.profile.facility);
      //fetchMyAlerts(authData.profile.facility);
      //setIsLoading(false);
    }
    fetchMyProfile();
  }, [authData.profile.facility]);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      savePushNotifToken(token);
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { seconds: 60, repeats: true },
    });
  }

  async function cacelSchedulePushNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function renderItem({ item, index }) {
    if (item.empty === true || item.type === "empty") {
      return <View style={[styles.item2, styles.itemInvisible]} />;
    }
    if (item.type === "block") {
      return <View style={styles.item2}></View>;
    } else {
      if (
        requestTables.some((el) => el.table === parseInt(item.table)) &&
        authData.hasPayment
      ) {
        return (
          <TouchableOpacity
            style={[
              styles.item,
              {
                backgroundColor: showText
                  ? theme.colors.primary
                  : theme.colors.accent,
              },
            ]}
            // onPress={() => navigation.navigate('Table', {club: authData.profile.facility, table:item.table})}>
            onPress={() =>
              navigation.navigate("Table", { club: clubId, table: item.table })
            }
          >
            <Text
              style={[
                styles.itemText,
                {
                  backgroundColor: showText
                    ? theme.colors.primary
                    : theme.colors.accent,
                },
              ]}
            >
              {item.table}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={[styles.item]}>
            <Text style={[styles.itemText]}>{item.table}</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  return (
    <Background>
      <Header>
        <Appbar.Content titleStyle={styles.appBarTitle} title="Home" />
        <Appbar.Action icon="" />

        {authData.showTimer ? (
          <>
            <Timer></Timer>
          </>
        ) : (
          <></>
        )}
        <Appbar.Action onPress={changeMode} icon="theme-light-dark" />
      </Header>
      <Text style={{ color: "white" }}>{texto}</Text>
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
       <Button
        title="Cancel schedule a notification"
        onPress={async () => {
          await cacelSchedulePushNotification();
        }}
      /> */}
      {textFindFacility ? (
        <>
          <Text style={styles.OutRange}>We can't find a facility near you</Text>
        </>
      ) : (
        <>
          <FlatList
            data={formatData(data, numColumns)}
            extraData={formatData(data, numColumns)}
            style={styles.container}
            renderItem={renderItem}
            numColumns={numColumns}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}

      {requestTables.length > 0 && !authData.hasPayment ? (
        <>
          <BlurView
            tint={authData.dark ? "light" : "dark"}
            intensity={80}
            style={[styles.containerMessageInteraction]}
          >
            <Text
              style={[
                { color: authData.dark ? "black" : "white" },
                styles.containerMessageInteractionText,
              ]}
            >
              You have a Message
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                padding: 5,
                marginVertical: 5,
                borderRadius: theme.roundness,
              }}
              onPress={() => navigation.jumpTo("Start")}
            >
              <Text
                style={[
                  { color: "white" },
                  styles.containerMessageInteractionTextPay,
                ]}
              >
                Start your session
              </Text>
            </TouchableOpacity>
          </BlurView>
        </>
      ) : (
        <></>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  item: {
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 0,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item2: {
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 0,

    height: Dimensions.get("window").width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#fff",
    backgroundColor: theme.colors.accent,
    fontSize: 10,
  },
  appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: "bold",
  },
  appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign: "right",
  },
  containerMessageInteraction: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "80%",
    height: 200,
  },
  containerMessageInteractionText: {
    textAlign: "center",
    margin: 5,
  },
  containerMessageInteractionTextPay: {
    textAlign: "center",
    margin: 5,
  },
  OutRange: {
    color: theme.colors.primary,
    fontSize: 35,
    textAlign: "center",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: "50%",
  },
});
