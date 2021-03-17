import React, {memo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch
} from 'react-native';
import {Card, Title, Paragraph, IconButton} from 'react-native-paper';
import BackgroundHome from '../components/BackgroundHome';
import ProfileImage from '../components/ProfileImage';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import DropDownList from '../components/DropDownList';
import ButtonsLogin from '../components/ButtonsLogin'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {descriptionValidator} from '../utils/utils';
import {theme} from '../utils/theme'
import { ThemeProvider } from '@react-navigation/native';

export default function RegisterScreen({navigation}) {
  const [description,
    setDescription] = useState({value: '', error:''});
  
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
      console.log(!isEnabled);
    };

  const [date,
    setDate] = useState(new Date());
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

  

  const _onSignUpPressed = () => {
    const descriptionError = descriptionValidator(description.value);
    

    if (descriptionError) {
      setDescription({
        ...description,
        error: descriptionError
      });
      
      return;
    }

    //navigation.navigate('Dashboard');
  };



  return (

    <BackgroundHome>

      <Header>Profile</Header>

      <ProfileImage
        source={{
        uri: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
      }}/>

      <TextInput
        label="Description"
        multiline={true}
        numberOfLines={3}
        returnKeyType="next"
        value={description.value}
        onChangeText={text => setDescription({value: text, error: ''})}
        error={!!description.error}
        errorText={description.error}/>

      <DropDownList
        items={[
        {
          label: 'Item 1',
          value: 'item1'
        }, {
          label: 'Item 2',
          value: 'item2'
        }
      ]}
        placeholder="Select your Race"
        zIndex='8000'
        containerStyle={{
        height: 70,
        width: '100%'
      }}
        onChangeItem={item => console.log(item.label, item.value)}/>

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
        placeholder="Select your Body type"
        containerStyle={{
        height: 70,
        width: '100%'
      }}
        zIndex='7000'
        onChangeItem={item => console.log(item.label, item.value)}/>

      <View style={styles.twoDrops} zIndex='6000'>
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
          height: 70,
          width: '50%',
          marginRight: 2
        }}
          placeholder="Color of hair"
          onChangeItem={item => console.log(item.label, item.value)}/>
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
          height: 70,
          width: '50%',
          marginLeft: 2
        }}
          placeholder="Color of eyes"
          onChangeItem={item => console.log(item.label, item.value)}/>

      </View>

      <View style={{
        width: '100%'
      }}>
        <Card style={styles.card}>
          <Card.Title title="Be live for 24 hrs"/>
          <Card.Content>
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
              height: 70,
              width: '100%',
              marginLeft: 2
            }}
              placeholder="Facility"
              zIndex='10000'
              onChangeItem={item => console.log(item.label, item.value)}/>
            <View style={styles.containerDatePickers}>
              <View style={{
                width: '80%'
              }}>

                <TextInput
                  label="Date"
                  returnKeyType="next"
                  value={date.toLocaleString()}
                  editable={false}
                  />
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}/>
              <View
                style={{
                width: '20%',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}>
                <IconButton color={theme.colors.primary} icon="calendar" size={40} onPress={showDatePicker}/>
              </View>
            </View>

            <View style={styles.containerDatePickers}>
              <View style={{
                width: '80%'
              }}>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.label}>Terms and conditions</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                width: '20%',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}>
                <Switch
                  trackColor={{
                  false: "#767577",
                  true: "#767577"
                }}
                  thumbColor={isEnabled
                  ? theme.colors.primary
                  : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}/>
              </View>
            </View>

            <Button disabled={!isEnabled} mode="contained" onPress={_onSignUpPressed} style={styles.button}>
              Pay
            </Button>
          </Card.Content>

        </Card>
      </View>

      {/* <Text style={styles.label}> Or </Text>
      <ButtonsLogin/>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.label}>By signing up you agree to our Terms of Service and Privacy Policy </Text>
        </TouchableOpacity>
      </View> */}
    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'left',
    width: '100%',
    marginVertical: 15,
    fontSize: 16,
    fontWeight: 'bold'
  },
  button: {
    marginTop: 24
  },
  row: {
    flexDirection: 'row',
    marginTop: 4
  },
  link: {
    fontWeight: 'bold'
  },
  twoDrops: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  containerDatePickers: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center'
  },
  itemDatePickers: {
    width: '50%'

  },
  card: {
    marginVertical: 10
  }
});
