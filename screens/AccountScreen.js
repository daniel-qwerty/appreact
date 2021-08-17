import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper";
import BackgroundHome from "../components/BackgroundHome";
import Header from "../components/Header";
import Button from "../components/Botton";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import TextInputForDate from "../components/TextInputDate";
import {
  emailValidator,
  nameValidator,
  latNameValidator,
  phoneValidator,
} from "../utils/utils";
import { Appbar } from "react-native-paper";
import { dark, light } from "../utils/theme";
import OverlayLoading from "../components/OverlayLoading";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import firebase from "firebase";
import "firebase/firestore";
import AuthContext from "../auth/context";
import axios from "axios";

export default function AccountScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [userName, setUserName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [idcusStripe, setIdcusStripe] = useState("");

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { authData, setAuthData } = useContext(AuthContext);
  const [dateBirth, setDateBirth] = useState(false);

  function openModalDeleteMedia() {
    setShowDeleteModal(true);
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const _onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const userNameError = nameValidator(userName.value);
    const emailError = emailValidator(email.value);
    const lastNameError = latNameValidator(lastName.value);
    const phoneError = phoneValidator(phone.value);

    setIsLoading(true);
    if (
      emailError ||
      nameError ||
      lastNameError ||
      phoneError ||
      userNameError
    ) {
      setName({ ...name, error: nameError });
      setUserName({ ...userName, error: userNameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPhone({ ...phone, error: phoneError });
      setIsLoading(false);
      return;
    }

    if (idcusStripe == "" || idcusStripe == null) {
      createCustomerStripe();
    } else {
      saveToFirebase();
      updateCustomerStripe(idcusStripe);
    }
  };

  function saveToFirebase() {
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        name: name.value,
        userName: userName.value,
        lastName: lastName.value,
        phone: phone.value,
        dateBirth: date,
        updated: Date.now(),
        idCusStripe: idcusStripe,
      })
      .then(() => {
        console.log("Document u successfully Saved!");
        setIsLoading(false);
        setAuthData({
          ...authData,
          profile: {
            ...authData.profile,
            name: name.value,
            userName: userName.value,
            lastName: lastName.value,
            phone: phone.value,
            dateBirth: date,
            updated: Date.now(),
            idCusStripe: idcusStripe,
          },
        });
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        setIsLoading(false);
      });
  }

  function setIdCustomerStripeFB(id) {
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("entertainers")
      .doc(user.uid)
      .update({
        idCusStripe: id,
        name: name.value,
        lastName: lastName.value,
        phone: phone.value,
        dateBirth: date,
        updated: Date.now(),
      })
      .then(() => {
        console.log("isdus successfully Saved!");
        setIdcusStripe(id);
        setIsLoading(false);
        setAuthData({
          ...authData,
          profile: {
            ...authData.profile,
            name: name.value,
            lastName: lastName.value,
            phone: phone.value,
            dateBirth: date,
            updated: Date.now(),
            idCusStripe: id,
          },
        });
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating idcus: ", error);
        setIsLoading(false);
      });
  }

  async function fetchMyAPI() {
    setIsLoading(true);
    const doc = await firebase
      .firestore()
      .collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .get();
    setName({ value: doc.data().name, error: "" });
    setUserName({ value: doc.data().userName, error: "" });
    setLastName({ value: doc.data().lastName, error: "" });
    setEmail({ value: doc.data().email, error: "" });
    setPhone({ value: doc.data().phone, error: "" });
    setIdcusStripe(doc.data().idCusStripe);
    setIsLoading(false);
  }

  async function createCustomerStripe() {
    await axios({
      method: "POST",
      url: "https://us-central1-test-minx.cloudfunctions.net/createCustomer",
      data: {
        email: email.value,
        name: `${name.value} ${lastName.value}`,
        phone: phone.value,
      },
    })
      .then((response) => {
        console.log("credao stripe");
        console.log(response.data);
        setIdCustomerStripeFB(response.data.id);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function updateCustomerStripe(id) {
    await axios({
      method: "POST",
      url: "https://us-central1-test-minx.cloudfunctions.net/updateCustomer",
      data: {
        customerId: id,
        email: email.value,
        name: `${name.value} ${lastName.value}`,
        phone: phone.value,
      },
    })
      .then((response) => {
        // console.log(response.data);
        console.log("customer stripe actualizado");
        return true;
      })
      .catch((error) => {
        console.log(error.response);
        console.log("customer stripe no actualizado");
        return false;
      });
  }

  useEffect(() => {
    if (!authData.profile) {
      fetchMyAPI();
    } else {
      setName({ value: authData.profile.name, error: "" });
      setUserName({ value: authData.profile.userName, error: "" });
      setLastName({ value: authData.profile.lastName, error: "" });
      setEmail({ value: authData.profile.email, error: "" });
      setPhone({ value: authData.profile.phone, error: "" });
      setIdcusStripe(authData.profile.idCusStripe);
    }
  }, [authData.profile]);

  return (
    <BackgroundHome>
      <OverlayLoading visible={isLoading} backgroundColor="rgba(0,0,0,0.6)" />
      <BackButton goBack={() => navigation.goBack()} />

      <Header>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="My Account"
          titleStyle={
            authData.dark ? stylesDark.appBarTitle : styles.appBarTitle
          }
        />
      </Header>

      <View style={authData.dark ? stylesDark.container : styles.container}>
        <TextInput
          label="Profile Name"
          returnKeyType="next"
          value={userName.value}
          onChangeText={(text) => setUserName({ value: text, error: "" })}
          error={!!userName.error}
          errorText={userName.error}
          autoCapitalize="none"
        />
        <TextInput
          label="Name"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: "" })}
          error={!!name.error}
          errorText={name.error}
        />

        <TextInput
          label="Last Name"
          returnKeyType="next"
          value={lastName.value}
          onChangeText={(text) => setLastName({ value: text, error: "" })}
          error={!!lastName.error}
          errorText={lastName.error}
        />

        <TextInput
          label="Phone"
          returnKeyType="next"
          value={phone.value}
          onChangeText={(text) => setPhone({ value: text, error: "" })}
          error={!!phone.error}
          errorText={phone.error}
        />

        <View style={{ width: "100%" }}>
          <TextInputForDate
            label="Date of birth "
            returnKeyType="go"
            value={date ? date.toLocaleDateString("en-US") : ""}
            editable={false}
          />
          <IconButton
            onPress={() => openModalDeleteMedia()}
            color={authData.dark ? dark.colors.primary : light.colors.primary}
            icon="calendar"
            size={30}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
        </View>

        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <Button
          mode="contained"
          onPress={_onSignUpPressed}
          style={authData.dark ? stylesDark.button : styles.button}
        >
          Save
        </Button>
        <View style={{ height: 200, width: "100%" }}>
          <Modal
            backdropOpacity={0.3}
            isVisible={showDeleteModal}
            onBackdropPress={closeDeleteModal}
            style={authData.dark ? stylesDark.contentView : styles.contentView}
          >
            <View style={authData.dark ? stylesDark.content : styles.content}>
              <Text style={styles.contentTitle}>Select Date 📅</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                style={{ width: "100%" }}
                textColor={authData.dark ? dark.colors.text : light.colors.text}
              />
              <Button
                mode="contained"
                onPress={closeDeleteModal}
                style={authData.dark ? stylesDark.button : styles.button}
              >
                Ok
              </Button>
            </View>
          </Modal>
        </View>
      </View>
    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    top: 20,
  },
  label: {
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
  appBarTitle: {
    color: light.colors.appBarTitleColor,
    fontWeight: "bold",
  },
  contentView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: light.colors.modalBackground,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: light.colors.text,
  },
});

const stylesDark = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    top: 20,
  },
  label: {
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
  appBarTitle: {
    color: dark.colors.appBarTitleColor,
    fontWeight: "bold",
  },
  contentView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: dark.colors.modalBackground,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: dark.colors.text,
  },
});
