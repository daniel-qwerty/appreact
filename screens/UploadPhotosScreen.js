import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import {Appbar} from 'react-native-paper';
import {theme} from '../utils/theme'
import * as ImagePicker from 'expo-image-picker';
import BackgroundHome from '../components/BackgroundHome';

export default class UploadPhotos extends Component {

  constructor(props) {
    super(props);
    this.data= [
        {id:1, title: "Product 1",  count:4, image:"https://via.placeholder.com/400x200/FFB6C1/000000"},
        {id:2, title: "Product 2",  count:4, image:"https://via.placeholder.com/400x200/87CEEB/000000"} ,
        
      ]
    this.state = {
     arrayHolder: [],
    
    };

    
  }
  componentDidMount() {
 
    this.setState({ arrayHolder: [...this.data] })
 
  }

  openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    this.data.push({id: new Date().getUTCMilliseconds(), title: "009",  count:4, image:pickerResult.uri},)
     this.setState({ arrayHolder: [...this.data] })
    console.log(pickerResult.uri);
  }

  addProductToCart = () => {
    this.state.data.push({id:2, title: "009",  count:4, image:"https://via.placeholder.com/400x200/FFB6C1/000000"},)
    this.state.data.push({id:2, title: "009",  count:4, image:"https://via.placeholder.com/400x200/FFB6C1/000000"},)
    //Alert.alert('Success', 'The product has been added to your cart')
  }

  render() {
    return (
      <BackgroundHome style={styles.container}>
        <Header>
          <Appbar.BackAction color='white' onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content titleStyle={styles.appBarTitle} title="Add Images" />
          <Appbar.Action icon="plus-box-multiple" color='white' onPress={this.openImagePickerAsync} />
        </Header>
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
           data={this.state.arrayHolder}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator}/>
            )
          }}
          renderItem={(post) => {
            const item = post.item;
            return (
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image style={styles.cardImage} source={{uri:item.image}}/>
                </View>
                {/* <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.count}>({item.count})</Text>
                </View> */}
              </View>
            )
          }}/>
      </BackgroundHome>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  list: {
    paddingHorizontal: 10,
  },
  listContainer:{
    alignItems:'center'
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card:{
    marginVertical: 8,
    backgroundColor:"white",
    flexBasis: '45%',
    marginHorizontal: 10,
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between',
  },
  cardImage:{
    flex: 1,
    height: 150,
    width: null,
  },
  imageContainer:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  /******** card components **************/
  title:{
    fontSize:18,
    flex:1,
    color:"#778899"
  },
  count:{
    fontSize:18,
    flex:1,
    color:"#B0C4DE"
  },
   appBarTitle: {
    color: theme.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
}); 