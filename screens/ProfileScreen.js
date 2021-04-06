import React, {memo, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
  Image
} from 'react-native';

import {Card, Title, Surface, IconButton, Appbar} from 'react-native-paper';
import BackgroundHome from '../components/BackgroundHome';
import ProfileImage from '../components/ProfileImage';
import Header from '../components/Header';
import Button from '../components/Botton';
import TextInput from '../components/TextInput';
import DropDownList from '../components/DropDownList';
import OnlyFansButton from '../components/OnlyFansButton';
import ButtonsLogin from '../components/ButtonsLogin'
import AuthContext from '../auth/context'

import {descriptionValidator} from '../utils/utils';
import {theme} from '../utils/theme'
import * as WebBrowser from 'expo-web-browser';

export default function RegisterScreen({navigation}) {

  const {authData, setAuthData} = useContext(AuthContext)

  const [description,
    setDescription] = useState({value: '', error: ''});
  const [name,
    setName] = useState('Barbie');
  const [email,
    setEmail] = useState('barbie13@gmail.com');

  const [isEnabled,
    setIsEnabled] = useState(false);
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

  //  _handleOpenWithWebBrowser = () => {
  //   WebBrowser.openBrowserAsync('https://www.onlyfans.com');
  // };

  return (

    <BackgroundHome>

       <Header>
         <Appbar.BackAction color='white' onPress={() => navigation.goBack()} />
        <Appbar.Content titleStyle={styles.appBarTitle} title="Profile" />
        <Appbar.Action icon="" />
        {authData.showTimer ? (
          <>
            <Appbar.Content titleStyle={styles.appBarTimer} subtitleStyle={styles.appBarTimer} title="22:45:34" subtitle="Availably"/>
          </>
        ) : <></>}
        <Appbar.Action icon="image-multiple" color='white' onPress={() => navigation.navigate('UploadPhotos')}/>
      </Header>

     <View style={styles.container}>

       

       <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          <Surface style={styles.userImageSurface}>
            <ProfileImage
              style={styles.userImage}
              source={{
              uri: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
            }}/>
          </Surface>

          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>{name}</Text>
          </View>
          <View style={styles.userBioRow}>
            <Text style={styles.userBioText}>{email}</Text>
          </View>
        </View>
        {/* <View style={styles.socialRow}>
          <Surface style={styles.socialIcon}>
            <Text style={styles.numberText}>23</Text>
            <Text style={styles.numberTitle}>Following</Text>
          </Surface>

          <Surface style={styles.socialIcon}>
            <Text style={styles.numberText}>54</Text>
            <Text style={styles.numberTitle}>Likes</Text>
          </Surface>

          <Surface style={styles.socialIcon}>
            <Text style={styles.numberText}>3</Text>
            <Text style={styles.numberTitle}>Lives</Text>
          </Surface>

        </View> */}
      </View>

      <View style={styles.containerDatePickers}>
              {/* <View style={{
                width: '80%'
              }}>
                  <Text style={styles.label}>Availability</Text>
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
              </View> */}
            </View>

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
        zIndex={8000}
        containerStyle={{
        height: 50,
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
        height: 50,
        width: '100%'
      }}
        zIndex={7000}
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
        height: 50,
        width: '100%',
        marginRight: 2
      }}
        placeholder="Color of hair"
        onChangeItem={item => console.log(item.label, item.value)}/>

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        Save
      </Button>

      {/* <View style={{
        width: '100%'
      }} zIndex={5000}>
        <Card style={styles.card} >
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
              height: 50,
              width: '100%',
              marginLeft: 2
            }}
              placeholder="Facility"
              zIndex={10000}
              onChangeItem={item => console.log(item.label, item.value)}/>
            <View style={styles.containerDatePickers}>
              <View style={{
                width: '80%'
              }}>

                <TextInput
                  label="Date"
                  returnKeyType="next"
                  value={date.toLocaleString()}
                  editable={false}/>
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
                <IconButton
                  color={theme.colors.primary}
                  icon="calendar"
                  size={40}
                  onPress={showDatePicker}/>
              </View>
            </View>

            <View style={styles.containerDatePickers}>
              <View style={{
                width: '80%'
              }}>

                <TouchableOpacity onPress={() => navigation.navigate('TermsConditions')}>
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

            <Button
              disabled={!isEnabled}
              mode="contained"
              onPress={_onSignUpPressed}
              style={styles.button}>
              Pay
            </Button>
          </Card.Content>

        </Card>
      </View> */}

      {/* <Text style={styles.label}> Or </Text>
      <ButtonsLogin/>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.label}>By signing up you agree to our Terms of Service and Privacy Policy </Text>
        </TouchableOpacity>
      </View> */}

     </View>

      

      
    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
   container: {
      alignItems     : 'center',
      justifyContent : 'center',
      width:'85%',
    },
  label: {
    textAlign: 'right',
    width: '100%',
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '600'
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
  },

  userBioRow: {
    marginLeft: 40,
    marginRight: 40
  },
  userBioText: {
    color: theme.colors.accent,
    fontSize: 13.5,
    textAlign: 'center'
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120
  },
  userImageSurface: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
    elevation: 5
  },
  userNameRow: {
    marginBottom: 10
  },
  userNameText: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12
  },
  socialIcon: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: '33.333%',
    elevation: 5
  },
  socialRow: {
    flexDirection: 'row',
    marginVertical: 10
  },
  numberText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white'
  },
  numberTitle: {
    textAlign: 'center',
    color: 'white'
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 10,
    marginTop: 50
  },
  appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
   appBarTimer: {
    color: theme.colors.appBarTitleColor,
    textAlign:'right'
  },
});
