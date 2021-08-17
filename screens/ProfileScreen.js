import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
  ActivityIndicator,
} from "react-native";

import {
  Card,
  Title,
  Surface,
  IconButton,
  Appbar,
  Snackbar,
} from "react-native-paper";
import BackgroundHome from "../components/BackgroundHome";
import ProfileImage from "../components/ProfileImage";
import Header from "../components/Header";
import Button from "../components/Botton";
import TextInput from "../components/TextInput";
import DropDownList from "../components/DropDownList";
import OnlyFansButton from "../components/OnlyFansButton";
import ButtonsLogin from "../components/ButtonsLogin";
import AuthContext from "../auth/context";
import Timer from "../components/Timer";
import OverlayLoading from "../components/OverlayLoading";
import * as ImagePicker from "expo-image-picker";

import { descriptionValidator } from "../utils/utils";
import { dark, light } from "../utils/theme";
import firebase from "firebase";
import "firebase/firestore";
import { uploadImageAsync, compressImage } from "../utils/utils";

export default function ProfileScreen({ navigation }) {
  const { authData, setAuthData } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState({
    localUri: null,
    remoteUri: null,
  });

  const [description, setDescription] = useState({ value: "", error: "" });
  const [race, setRace] = useState({ value: "", error: "" });
  const [bodyType, setBodyType] = useState({ value: "", error: "" });
  const [colorHair, setColorHair] = useState({ value: "", error: "" });
  const [email, setEmail] = useState("barbie13@gmail.com");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  async function fetchMyAPI() {
    setIsLoading(true);
    const doc = await firebase
      .firestore()
      .collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .get();
    setDescription({ value: doc.data().description, error: "" });
    setBodyType({ value: doc.data().bodyType, error: "" });
    setColorHair({ value: doc.data().colorHair, error: "" });
    setRace({ value: doc.data().race, error: "" });
    setName(doc.data().userName);
    setEmail(doc.data().email);
    setSelectedImage({ localUri: doc.data().thumbnail, error: "" });
    setIsLoading(false);
  }

  useEffect(() => {
    if (!authData.profile) {
      fetchMyAPI();
    } else {
      setDescription({ value: authData.profile.description, error: "" });
      setBodyType({ value: authData.profile.bodyType, error: "" });
      setColorHair({ value: authData.profile.colorHair, error: "" });
      setRace({ value: authData.profile.race, error: "" });
      setName(authData.profile.userName);
      setEmail(authData.profile.email);
      setSelectedImage({ localUri: authData.profile.thumbnail, error: "" });
    }
  }, []);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      quality: 0.3,
    });
    //console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }

    var user = firebase.auth().currentUser;
    setIsLoadingImage(true);
    var compImage = (await compressImage(pickerResult.uri, 800)).uri;
    var thumbnail = (await compressImage(pickerResult.uri, 200)).uri;
    const uploadUrl = await uploadImageAsync(
      compImage,
      "profiles",
      firebase.auth().currentUser.uid
    );
    const uploadUrlThumb = await uploadImageAsync(
      thumbnail,
      "thumbnails",
      firebase.auth().currentUser.uid
    );
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        updated: Date.now(),
        profileImage: uploadUrl,
        thumbnail: uploadUrlThumb,
      })
      .then(() => {
        setSelectedImage({ localUri: compImage, remoteUri: null });
        setIsLoadingImage(false);
        setAuthData({
          ...authData,
          profile: {
            ...authData.profile,
            profileImage: uploadUrl,
            thumbnail: uploadUrlThumb,
          },
        });
        console.log("Image successfully Saved!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating Image: ", error);
      });
  };

  const _onSignUpPressed = async () => {
    const descriptionError = descriptionValidator(description.value);
    setIsLoading(true);
    if (descriptionError) {
      setDescription({
        ...description,
        error: descriptionError,
      });
      setIsLoading(false);
      return;
    }
    //save changes on firestore
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        description: description.value,
        race: race.value,
        bodyType: bodyType.value,
        colorHair: colorHair.value,
        updated: Date.now(),
      })
      .then(() => {
        console.log("Profile successfully Saved!");
        setSnackBarMessage("Profile successfully Saved!");
        setSnackBarVisible(!snackBarVisible);
        setAuthData({
          ...authData,
          profile: {
            ...authData.profile,
            description: description.value,
            race: race.value,
            bodyType: bodyType.value,
            colorHair: colorHair.value,
            updated: Date.now(),
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    console.log("profileScreen", authData);
  }, [authData]);

  return (
    <BackgroundHome>
      <OverlayLoading visible={isLoading} backgroundColor="rgba(0,0,0,0.6)" />
      <Header>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={name} titleStyle={styles.appBarTitle} />

        {authData.showTimer ? (
          <>
            <Timer></Timer>
          </>
        ) : (
          <></>
        )}
        <Appbar.Action
          icon="image-multiple"
          color="white"
          onPress={() => navigation.navigate("UploadPhotos")}
        />
      </Header>

      <View style={authData.dark ? stylesDark.container : styles.container}>
        <View
          style={
            authData.dark ? stylesDark.headerContainer : styles.headerContainer
          }
        >
          <View style={authData.dark ? stylesDark.userRow : styles.userRow}>
            <TouchableOpacity onPress={openImagePickerAsync}>
              <Surface
                style={
                  authData.dark
                    ? stylesDark.userImageSurface
                    : styles.userImageSurface
                }
              >
                {isLoadingImage ? (
                  <>
                    <View
                      style={
                        authData.dark
                          ? stylesDark.viewActiveIndicator
                          : styles.viewActiveIndicator
                      }
                    >
                      <ActivityIndicator
                        color={
                          authData.dark
                            ? dark.colors.primary
                            : light.colors.primary
                        }
                        animating
                        size="large"
                        style={
                          authData.dark
                            ? stylesDark.activeIndicator
                            : styles.activeIndicator
                        }
                      />
                    </View>
                  </>
                ) : (
                  <></>
                )}
                <ProfileImage
                  style={
                    authData.dark ? stylesDark.userImage : styles.userImage
                  }
                  source={{
                    uri: selectedImage.localUri,
                  }}
                />
              </Surface>
            </TouchableOpacity>

            <View
              style={
                authData.dark ? stylesDark.userNameRow : styles.userNameRow
              }
            >
              <TouchableOpacity onPress={openImagePickerAsync}>
                <Text
                  style={
                    authData.dark
                      ? stylesDark.changeImageText
                      : styles.changeImageText
                  }
                >
                  Change Image
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={authData.dark ? stylesDark.userBioRow : styles.userBioRow}
            >
              {/* <Text style={styles.userBioText}>{email}</Text> */}
            </View>
          </View>
        </View>

        <TextInput
          label="Description"
          multiline={true}
          numberOfLines={3}
          returnKeyType="next"
          value={description.value}
          onChangeText={(text) => setDescription({ value: text, error: "" })}
          error={!!description.error}
          errorText={description.error}
        />

        <Text
          style={
            authData.dark ? stylesDark.labelDropDown : styles.labelDropDown
          }
        >
          Select your Race
        </Text>
        <DropDownList
          items={[
            {
              label: "",
              value: "",
            },
            {
              label: "Asian",
              value: "Asian",
            },
            {
              label: "Black or African American",
              value: "Black or African American",
            },
            {
              label: "Native Hawaiian or Other Pacific Islander",
              value: "Native Hawaiian or Other Pacific Islander",
            },
            {
              label: "White",
              value: "White",
            },
            {
              label: "Hispanic or Latino",
              value: "Hispanic or Latino",
            },
          ]}
          placeholder="Select your Race"
          zIndex={8000}
          maxHeight={500}
          containerStyle={{
            height: 50,
            width: "100%",
          }}
          defaultValue={race.value}
          onChangeItem={(item) => setRace({ value: item.value, error: "" })}
        />

        <Text
          style={
            authData.dark ? stylesDark.labelDropDown : styles.labelDropDown
          }
        >
          Select your Body type
        </Text>
        <DropDownList
          items={[
            {
              label: "",
              value: "",
            },
            {
              label: "Pear",
              value: "Pear",
            },
            {
              label: "Diamond",
              value: "Diamond",
            },
            {
              label: "Apple",
              value: "Apple",
            },
            {
              label: "Hourglass",
              value: "Hourglass",
            },
            {
              label: "Straight",
              value: "Straight",
            },
            {
              label: "Full Bust",
              value: "Full Bust",
            },
          ]}
          placeholder="Select your Body type"
          containerStyle={{
            height: 50,
            width: "100%",
          }}
          zIndex={7000}
          itemSeparator={true}
          height={900}
          defaultValue={bodyType.value}
          onChangeItem={(item) => setBodyType({ value: item.value, error: "" })}
        />

        <Text
          style={
            authData.dark ? stylesDark.labelDropDown : styles.labelDropDown
          }
        >
          Color of hair
        </Text>
        <DropDownList
          items={[
            {
              label: "",
              value: "",
            },
            {
              label: "Black",
              value: "Black",
            },
            {
              label: "Blond",
              value: "Blond",
            },
            {
              label: "Brown",
              value: "Brown",
            },
            {
              label: "Red",
              value: "Red",
            },
          ]}
          containerStyle={{
            height: 50,
            width: "100%",
            marginRight: 2,
          }}
          placeholder="Color of hair"
          defaultValue={colorHair.value}
          onChangeItem={(item) =>
            setColorHair({ value: item.value, error: "" })
          }
        />

        <Button
          mode="contained"
          onPress={_onSignUpPressed}
          style={authData.dark ? stylesDark.button : styles.button}
        >
          Save
        </Button>

        <Snackbar
          visible={snackBarVisible}
          onDismiss={onDismissSnackBar}
          duration={2000}
          action={{
            label: "X",
            // onPress: () => {
            //   // Do something
            //   console.log('object');
            // },
          }}
        >
          {snackBarMessage}
        </Snackbar>
      </View>
    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
  },
  label: {
    textAlign: "right",
    width: "100%",
    marginVertical: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
  },
  twoDrops: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
  itemDatePickers: {
    width: "50%",
  },
  card: {
    marginVertical: 10,
  },

  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: light.colors.accent,
    fontSize: 13.5,
    textAlign: "center",
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userImageSurface: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
    elevation: 5,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: light.colors.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  changeImageText: {
    color: light.colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialIcon: {
    backgroundColor: light.colors.primary,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: "33.333%",
    elevation: 5,
  },
  socialRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  numberText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  numberTitle: {
    textAlign: "center",
    color: "white",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 50,
  },
  appBarTitle: {
    color: light.colors.appBarTitleColor,
    fontWeight: "bold",
  },
  appBarTimer: {
    color: light.colors.appBarTitleColor,
    textAlign: "right",
  },
  labelDropDown: {
    color: light.colors.primary,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 12,
  },
  activeIndicator: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6999,
  },
  viewActiveIndicator: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    zIndex: 6998,
    borderRadius: 60,
  },
});

const stylesDark = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
  },
  label: {
    textAlign: "right",
    width: "100%",
    marginVertical: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
  },
  twoDrops: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
  itemDatePickers: {
    width: "50%",
  },
  card: {
    marginVertical: 10,
  },

  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: dark.colors.accent,
    fontSize: 13.5,
    textAlign: "center",
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userImageSurface: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
    elevation: 5,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: dark.colors.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  changeImageText: {
    color: dark.colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialIcon: {
    backgroundColor: dark.colors.primary,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: "33.333%",
    elevation: 5,
  },
  socialRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  numberText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  numberTitle: {
    textAlign: "center",
    color: "white",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 50,
  },
  appBarTitle: {
    color: dark.colors.appBarTitleColor,
    fontWeight: "bold",
  },
  appBarTimer: {
    color: dark.colors.appBarTitleColor,
    textAlign: "right",
  },
  labelDropDown: {
    color: dark.colors.primary,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 12,
  },
  activeIndicator: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6999,
  },
  viewActiveIndicator: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    zIndex: 6998,
    borderRadius: 60,
  },
});
