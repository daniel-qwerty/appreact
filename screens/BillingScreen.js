import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {List, IconButton, Card, Icon} from 'react-native-paper';

import Logo from '../components/Logo'
import Background from '../components/Background'
import TextInputForDate from '../components/TextInputDate';
import Button from '../components/Botton'
import Header from '../components/Header'
import {theme} from '../utils/theme'
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function BillingScreen({navigation}) {

  const data = [
    {
      "date": "2020-12-12",
      "description": "Be live 24hrs at Booby trap",
      "total": 20
    }, {
      "date": "2020-12-12",
      "description": "Be live 24hrs at Booby trap",
      "total": 50
    }, {
      "date": "2020-12-12",
      "description": "Be live 24hrs at Booby trap",
      "total": 10
    }, {
      "date": "2020-12-12",
      "description": "Be live 24hrs at Booby trap",
      "total": 20
    }, {
      "date": "2020-12-12",
      "description": "Be live 24hrs at Booby trap",
      "total": 70
    }
  ]

  const [listData,
    setListData] = React.useState(data);

  const [date,
    setDate] = useState();

  const [isDatePickerVisible,
    setDatePickerVisibility] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    //console.warn("A date has been picked: ", date);
    const currentDate = date;
    setDate(currentDate);
    hideDatePicker();
  };

  function renderItem({item}) {
    return (
      <View
        style={{
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1
      }}>
        <List.Item
          style={styles.itemContainer}
          title={item.date}
          description={item.description}
          right={props => <Text
          {...props}
          style={{
          fontSize: 20,
          marginVertical: 10,
          marginHorizontal: 5
        }}>${item.total}</Text>}/>
      </View>

    );
  }

  useEffect(() => {

    setDate(new Date())

  }, [])

  return (
    <Background>

      <Header>Billing</Header>

      <Card style={styles.card}>

        <Card.Content >

          <TextInputForDate
            label="From"
            returnKeyType="go"
            value={date
            ? date.toLocaleDateString("en-US")
            : ''}
            editable={true}
            onFocus={showDatePicker}/>
          <TextInputForDate
            label="To"
            returnKeyType="go"
            value={date.toLocaleDateString("en-US")}
            editable={true}
            onFocus={showDatePicker}/>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}/>

        </Card.Content>
      </Card>

      <FlatList
        style={{
        height: '100%',
        width: '100%',
        marginHorizontal: 10
      }}
        data={listData}
        renderItem={renderItem}
        numColumns={1}/>

    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.accent
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: 40
  },
  card: {
    marginVertical: 10,
    height: 200,
    width: '100%'
  }
});
