import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {List, IconButton, Card, Surface, Appbar} from 'react-native-paper';

import Logo from '../components/Logo'
import Background from '../components/Background'
import TextInputForDate from '../components/TextInputDate';
import Button from '../components/Botton'
import FilterButton from '../components/FilterButton'
import Header from '../components/Header'
import {theme} from '../utils/theme'
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownList from '../components/DropDownList';
import BackButton from '../components/BackButton';

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

  const [dateFrom,
    setDateFrom] = useState(false);
  const [dateTo,
    setDateTo] = useState(false);

  const [isDatePickerVisibledDateFrom,
    setDatePickerVisibilityDateFrom] = useState(false);

  const [isDatePickerVisibledDateTo,
    setDatePickerVisibilityDateTo] = useState(false);

  const [isFilterDatesVisibled,
    setIsFilterDatesVisibled] = useState(false);

  const showFilterDates = () => {
    //setIsFilterDatesVisibled(true);
    setIsFilterDatesVisibled(previousState => !previousState);
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

  function renderItem({item}) {
    return (
      <View
        style={{
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1
      }}>
        <Surface style={styles.surface}>
           <List.Item
          style={styles.itemContainer}
          title={item.date}
          description={item.description}
          right={props => <Text
          {...props}
          style={{
          fontSize: 25,
          marginVertical: 10,
          marginHorizontal: 5
        }}>${item.total}</Text>}/>
        </Surface>
       
      </View>

    );
  }

  return (
    
    <Background>

      <Appbar.Header style={{width:'100%'}}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="My Biiling"  />
      <Appbar.Action icon="calendar" onPress={showFilterDates} />
    </Appbar.Header>

    

      {isFilterDatesVisibled
        ? (
          <Card style={styles.cardDates}>
            <Card.Content >
              <TextInputForDate
                label="From"
                returnKeyType="go"
                value={dateFrom
                ? dateFrom.toLocaleDateString("en-US")
                : ''}
                editable={true}
                onFocus={showDatePickerFrom}/>

              <TextInputForDate
                label="To"
                returnKeyType="go"
                value={dateTo
                ? dateTo.toLocaleDateString("en-US")
                : ''}
                editable={true}
                onFocus={showDatePickerTo}/>

              {/* <DateTimePickerModal
                isVisible={isDatePickerVisibledDateTo}
                mode="date"
                onConfirm={handleConfirmTo}
                onCancel={hideDatePickerTo}/>

              <DateTimePickerModal
                isVisible={isDatePickerVisibledDateFrom}
                mode="date"
                onConfirm={handleConfirmFrom}
                onCancel={hideDatePickerFrom}/> */}

            </Card.Content>
          </Card>
        )
        : ( <></>)}

      <Card style={styles.cardFilter} zIndex={7000}>
        <Card.Content >
          <DropDownList
            items={[
            {
              label: 'Item 4',
              value: 'item5'
            }, {
              label: 'Item 5',
              value: 'item6'
            }
          ]}
            containerStyle={{
            height: 50,
            width: '100%'
          }}
          zIndex={7000}
            placeholder="Color of eyes"
            onChangeItem={item => console.log(item.label, item.value)}/>
        </Card.Content>
      </Card>

      <FlatList
        style={{
        height: '100%',
        width: '85%',
        marginHorizontal: 10
      }}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        zIndex={6000}/>

    </Background>
  );
}

//donde es tu codigo?

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
  surface:{
    borderRadius: 25,
    elevation:3
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
  cardDates: {
    marginVertical: 10,
    height: 150,
    width: '85%'
  },
  cardFilter: {
    marginVertical: 10,
    height: 80,
    width: '85%',
    backgroundColor: theme.colors.primary,
     borderRadius: 25,
  }
});
