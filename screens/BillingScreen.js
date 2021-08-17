import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { List, IconButton, Card, Surface, Appbar } from "react-native-paper";

import Logo from "../components/Logo";
import Background from "../components/Background";
import TextInputForDate from "../components/TextInputDate";
import Button from "../components/Botton";
import FilterButton from "../components/FilterButton";
import Header from "../components/Header";
import { theme, dark, light } from "../utils/theme";
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownList from "../components/DropDownList";
import BackButton from "../components/BackButton";
import AuthContext from "../auth/context";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import OverlayLoading from "../components/OverlayLoading";

export default function BillingScreen({ navigation }) {
  const { authData, setAuthData } = useContext(AuthContext);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState(false);
  const [dateTo, setDateTo] = useState(false);

  const [isDatePickerVisibledDateFrom, setDatePickerVisibilityDateFrom] =
    useState(false);

  const [isDatePickerVisibledDateTo, setDatePickerVisibilityDateTo] =
    useState(false);

  const [isFilterDatesVisibled, setIsFilterDatesVisibled] = useState(false);

  const showFilterDates = () => {
    //setIsFilterDatesVisibled(true);
    setIsFilterDatesVisibled((previousState) => !previousState);
  };

  const hideFilterDates = () => {
    setIsFilterDatesVisibled(false);
  };

  const showDatePickerFrom = () => {
    setDatePickerVisibilityDateFrom(true);
  };

  const hideDatePickerFrom = () => {
    setDatePickerVisibilityDateFrom(false);
  };

  const showDatePickerTo = () => {
    setDatePickerVisibilityDateTo(true);
  };

  const hideDatePickerTo = () => {
    setDatePickerVisibilityDateTo(false);
  };

  const handleConfirmFrom = (date) => {
    const currentDate = date;
    setDateFrom(currentDate);
    hideDatePickerFrom();
  };

  const handleConfirmTo = (date) => {
    const currentDate = date;
    setDateTo(currentDate);
    hideDatePickerTo();
  };

  async function getPaymentsStripe() {
    setIsLoading(true);
    await axios({
      method: "POST",
      url: "https://us-central1-test-minx.cloudfunctions.net/getInvoices",
      data: {
        customerId: authData.profile.idCusStripe,
        limit: 50,
      },
    })
      .then((response) => {
        console.log("credao stripe");
        //console.log(response.data);
        let mydata = response.data.data;
        setArrayHolder([...mydata]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function convertDate(timestamp) {
    let d = new Date(timestamp * 1000);
    return d.toLocaleDateString("en-US");
  }

  function openReceipt(data) {
    if (data.data[0].receipt_url) {
      WebBrowser.openBrowserAsync(data.data[0].receipt_url);
    }
  }
  useEffect(() => {
    getPaymentsStripe();
  }, []);

  function renderItem({ item }) {
    return (
      <View
        style={{
          marginVertical: 5,
          marginHorizontal: 5,
          flex: 1,
        }}
      >
        <Surface style={authData.dark ? stylesDark.surface : styles.surface}>
          <List.Item
            onPress={() => openReceipt(item.charges)}
            style={
              authData.dark ? stylesDark.itemContainer : styles.itemContainer
            }
            title={convertDate(item.created)}
            description={
              <>
                {item.last_payment_error ? (
                  <Text>{item.last_payment_error.message}</Text>
                ) : (
                  <Text>{item.description}</Text>
                )}
              </>
            }
            right={(props) => (
              <>
                {item.last_payment_error ? null : (
                  <Text
                    {...props}
                    style={{
                      color: authData.dark
                        ? dark.colors.primary
                        : light.colors.primary,
                      fontSize: 25,
                      marginVertical: 10,
                      marginHorizontal: 5,
                    }}
                  >
                    ${item.amount / 100}
                  </Text>
                )}
              </>
            )}
          />
        </Surface>
      </View>
    );
  }

  return (
    <Background>
      <OverlayLoading visible={isLoading} backgroundColor="rgba(0,0,0,0.6)" />
      <Appbar.Header style={{ width: "100%" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Financial information" />
        {/* <Appbar.Action icon="calendar" onPress={showFilterDates} /> */}
      </Appbar.Header>

      {isFilterDatesVisibled ? (
        <Card style={authData.dark ? stylesDark.cardDates : styles.cardDates}>
          <Card.Content>
            <View style={{ width: "100%" }}>
              <TextInputForDate
                label="from "
                returnKeyType="go"
                value={dateFrom ? dateFrom.toLocaleDateString("en-US") : ""}
                editable={false}
              />
              <IconButton
                color={
                  authData.dark ? dark.colors.primary : light.colors.primary
                }
                icon="calendar"
                size={30}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />
            </View>

            <View style={{ width: "100%" }}>
              <TextInputForDate
                label="To "
                returnKeyType="go"
                value={dateTo ? dateTo.toLocaleDateString("en-US") : ""}
                editable={false}
              />
              <IconButton
                color={
                  authData.dark ? dark.colors.primary : light.colors.primary
                }
                icon="calendar"
                size={30}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />
            </View>
          </Card.Content>
        </Card>
      ) : (
        <></>
      )}

      {/* <Card style={styles.cardFilter} zIndex={7000}>
        <Card.Content >
          <DropDownList
            items={[
            {
              label: 'Outgoing',
              value: 'Outgoing'
            },
            {
              label: 'Incoming',
              value: 'Incoming'
            }
          ]}
            containerStyle={{
            height: 50,
            width: '100%'
          }}
          defaultValue="Outgoing"
          zIndex={7000}
            onChangeItem={item => console.log(item.label, item.value)}/>
        </Card.Content>
      </Card> */}

      <FlatList
        style={{
          height: "100%",
          width: "85%",
          marginHorizontal: 10,
        }}
        data={arrayHolder}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        zIndex={6000}
      />
    </Background>
  );
}

//donde es tu codigo?

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    backgroundColor: light.colors.background,
    width: "100%",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: light.colors.primary,
  },
  surface: {
    borderRadius: 25,
    elevation: 3,
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: "100%",
    height: 40,
  },
  cardDates: {
    marginVertical: 10,
    height: 150,
    width: "85%",
    backgroundColor: light.colors.inputBackground,
  },
  cardFilter: {
    marginVertical: 10,
    height: 80,
    width: "85%",
    backgroundColor: light.colors.primary,
    borderRadius: 25,
  },
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    backgroundColor: dark.colors.background,
    width: "100%",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: dark.colors.primary,
  },
  surface: {
    borderRadius: 25,
    elevation: 3,
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: "100%",
    height: 40,
  },
  cardDates: {
    marginVertical: 10,
    height: 150,
    width: "85%",
    backgroundColor: dark.colors.inputBackground,
  },
  cardFilter: {
    marginVertical: 10,
    height: 80,
    width: "85%",
    backgroundColor: dark.colors.primary,
    borderRadius: 25,
  },
});
