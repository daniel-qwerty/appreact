import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import {Surface} from 'react-native-paper';
import Background from '../components/Background'
import Paragraph from '../components/Paragraph'
import Button from '../components/Botton'
import Header from '../components/Header'
import {theme} from '../utils/theme';

export default function FollowersScreen({navigation}) {
  const picsumImages = new Array(11).fill("http://placeimg.com/640/360/any");

  const numColumns = 3;

  const [images,
    setImages] = React.useState(picsumImages);

  function renderItem({item}) {
    return (
      <View
        style={{
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1 / numColumns
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('FollowerProfile')}>
          <Surface style={styles.surface}>
            <Image
              source={{
              uri: item
            }}
              style={styles.renderItemImage}/>
          </Surface>

        </TouchableOpacity>

        <Text style={styles.renderItemText}>James Bond</Text>
      </View>

    );
  }
  return (
    <Background>

      <Header>Followers</Header>

      <FlatList
        style={{
        height: '100%',
        width: '100%',
      
      }}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}/>

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
  rederItem: {},
  renderItemImage: {
    aspectRatio: 1,
    borderRadius: 50,
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  renderItemText: {
    marginHorizontal: 0,
    marginVertical: 5,
    width: '100%'
  },
  surface:{
    borderRadius: 50,
    elevation:4
  },
});
