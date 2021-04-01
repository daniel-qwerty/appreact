import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {Surface} from 'react-native-paper';
import Background from '../components/Background'
import {theme} from '../utils/theme'
import Header from '../components/Header'
import data  from "../utils/dataMaps/map1";


 const numColumns = 14;

export default function DirectMessagesScreen({navigation}) {

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return data;
  };

   const [showText, setShowText] = useState(true);

  useEffect(() => {
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText((showText) => !showText);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  function renderItem({item, index}) {
    if (item.empty === true || item.key === '') {
      return <View style={[styles.item2, styles.itemInvisible]}/>;
    }
    if (item.key === 'x') {
      return (
        <View style={styles.item2}></View>
      );
    } else {
      if(item.status){
        return (
          <TouchableOpacity
            style={[
            styles.item, {
              backgroundColor: showText
                ? theme.colors.primary
                : theme.colors.accent
            }
          ]}
            onPress={() => navigation.navigate('Table', {club: 'club 1', table:item.key, seat:'3'})}>
            <Text
              style={[
              styles.itemText, {
                backgroundColor: showText
                  ? theme.colors.primary
                  : theme.colors.accent
              }
            ]}>{item.key}</Text>

          </TouchableOpacity>
        );
      } else {
        return (
        <TouchableOpacity
          style={[
          styles.item
        ]}
      >

          <Text
            style={[
            styles.itemText
          ]}>{item.key}</Text>

        </TouchableOpacity>
      );
      }
      
    }
  };

 
  return (
    <Background>
      <Header>Map</Header>
      <FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}/>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    width: '100%'
  },
  item: {
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  item2: {
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,

    height: Dimensions
      .get('window')
      .width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent'
  },
  itemText: {
    color: '#fff',
    backgroundColor: theme.colors.accent,
    fontSize: 10
  }
});
