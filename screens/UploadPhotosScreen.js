import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';
import Header from '../components/Header';
import {Appbar, IconButton, Dialog, Portal, Paragraph} from 'react-native-paper';
import {dark, light} from '../utils/theme'
import * as ImagePicker from 'expo-image-picker';
import BackgroundHome from '../components/Background';
import OverlayLoading from '../components/OverlayLoading';
import firebase from 'firebase';
import "firebase/firestore";
import {uploadImageAsync, compressImage, deleteFileFromStorage} from '../utils/utils';
import Modal from 'react-native-modal';
import { Video } from 'expo-av';
import Button from '../components/Botton';
import AuthContext from '../auth/context'


export default function UploadPhotos({navigation}) {

   const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [imageData, setImageData] = useState(true);
  const {authData, setAuthData} = useContext(AuthContext)
  const [arrayHolder,
    setArrayHolder] = useState([]);
  const [isLoading,
    setIsLoading] = useState(false);

  var data = []

  function openModalImage(data) {
    setImageData(data);
    setShowStatusModal(true);
  };

  function openModalDeleteMedia(data) {
    setImageData(data);
    setShowDeleteModal(true);
  };

  function openModalDeleteMedia2(data) {
    setShowStatusModal(false);
    setImageData(data);
    setShowDeleteModal(true);
  };



  function deleteMedia() {
     setIsLoading(true);
    firebase
      .firestore().collection("entertainers").doc(firebase.auth().currentUser.uid).collection('gallery').doc(imageData.id).delete()
      .then(() => {
        alert("Item successfully deleted!")
        deleteFileFromStorage(`gallery/${firebase.auth().currentUser.uid}/`,(imageData.type != 'video') ? imageData.name : `${imageData.name}.mp4`)
        setShowDeleteModal(false)
        
        setIsLoading(false);
        fetchMyAPI()
    }).catch((error) => {
        setShowDeleteModal(false)
        setIsLoading(false);
        console.error("Error removing document: ", error);
    });

  }

  function setFavoriteMedia(item) {
    firebase
      .firestore().collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .collection('gallery')
      .doc(item.id)
      .update({
        favorite: !item.favorite  
      })
      .then(() => {
        fetchMyAPI()
    }).catch((error) => {
        console.error("Error uodate favorite: ", error);
    });

  }

  function checkImagesClub(){
    var count = 0;
    arrayHolder.forEach(function (doc) {
      //console.log(doc);
      if(doc.tags){
        if(doc.tags.includes("club")){
          count++;  
        }
      }
    })
    console.log(count);
    if(count+1 <= 5){
      return true
    } else { return false}
  }

  function setTagsMedia(name) {
    console.log(name);
    if(imageData.tags && imageData.tags.indexOf(name) !== -1){
        deleteTags(name);
    } else{
        if(name === 'club') {
          if(checkImagesClub()){
            saveTags(name)
          } else {
            alert('You can only set 5 Club tags')
          }
        } else {
          saveTags(name)
        }
        
       
    }

  }

  function saveTags(name) {
    firebase
      .firestore().collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .collection('gallery')
      .doc(imageData.id)
      .update({
        tags: firebase.firestore.FieldValue.arrayUnion(name)
      })
      .then(() => {
        fetchMyAPI()
        setShowTagModal(false)
    }).catch((error) => {
        console.error("Error save tags: ", error);
    });
  }

  function deleteTags(name) {
    firebase
      .firestore().collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .collection('gallery')
      .doc(imageData.id)
      .update({
        tags: firebase.firestore.FieldValue.arrayRemove(name)
      })
      .then(() => {
        fetchMyAPI()
        setShowTagModal(false)
    }).catch((error) => {
        console.error("Error delete tags: ", error);
    });
  }
  

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  function openTagModal(data) {
    setImageData(data);
    setShowTagModal(true)
  }

  const closeTagModal = () => {
    setShowTagModal(false)
  }

  function openModalImage(data) {
    setImageData(data);
    setShowStatusModal(true);
  };

  const closeModalStatus = () => {
    setShowStatusModal(false);
  };

  async function fetchMyAPI() {
    var all = [];
    await firebase
      .firestore()
      .collection("entertainers")
      .doc(firebase.auth().currentUser.uid)
      .collection('gallery')
      .get()
      .then(function (querySnapshot) {
        querySnapshot
          .forEach(function (doc) {
            all.push({
              id: doc.id,
              type: doc.data().type,
              likes: doc.data().likes,
              favorite: doc.data().favorite,
              name: doc.data().name,
              tags: doc.data().tags,
              url: doc
                .data()
                .url
            },)
          });

        setArrayHolder([...all]);
      })

  }

  useEffect(() => {
    fetchMyAPI()
  }, []);

  async function openImagePickerAsync() {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({quality: 0.3, mediaTypes: ImagePicker.MediaTypeOptions.All});
    if (pickerResult.cancelled === true) {
      return;
    }

    if (pickerResult.type === "video" && pickerResult.duration > 5000) {
      alert('You can only upload 10 seconds video')
      return;
    }

    var user = firebase
      .auth()
      .currentUser;
    setIsLoading(true);
    var compImage = null;
    var uploadUrl = null;
    var imageOrientation = null;
    var imageName = `${Date.now()}-${user.uid}`;
    if (pickerResult.type === "video") {
      compImage = (pickerResult.uri)
      uploadUrl = await uploadImageAsync(compImage, `gallery/${user.uid}/`, `${imageName}.mp4`);
    } else {
      Image.getSize(pickerResult.uri, (width, height) => {
        console.log(`The image dimensions are ${width}x${height}`);
        if(width > height){
          imageOrientation = 'landscape'
        } else {
          imageOrientation = 'portrait'
        }
      }, (error) => {
        console.error(`Couldn't get the image size: ${error.message}`);
      });
      compImage = (await compressImage(pickerResult.uri, 800)).uri
      uploadUrl = await uploadImageAsync(compImage, `gallery/${user.uid}/`, `${imageName}`);
    }

    const db = firebase.firestore();
    db
      .collection("entertainers")
      .doc(user.uid)
      .collection("gallery")
      .doc()
      .set({
        created: Date.now(),
        url: uploadUrl,
        type: (pickerResult.type === "video")? 'video' : 'image',
        likes: 0,
        favorite: false,
        name: imageName,
        orientation: imageOrientation
      })
      .then(() => {
        fetchMyAPI()
        setIsLoading(false);
        console.log("Image successfully Saved!");
      })
      .catch((error) => {
        console.error("Error updating Image: ", error);
      });

  }

 
  return (

    <BackgroundHome style={authData.dark ? stylesDark.container : styles.container}>
      <OverlayLoading visible={isLoading} backgroundColor='rgba(0,0,0,0.6)'/>
      <Header>
        <Appbar.BackAction color='white' onPress={() => navigation.goBack()}/>
        <Appbar.Content titleStyle={authData.dark ? stylesDark.appBarTitle : styles.appBarTitle} title="Add Images"/>
        <Appbar.Action
          icon="plus-box-multiple"
          color='white'
          onPress={openImagePickerAsync}/>
      </Header>

      <FlatList
        style={authData.dark ? stylesDark.list : styles.list}
        contentContainerStyle={authData.dark ? stylesDark.listContainer : styles.listContainer}
        data={arrayHolder}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
        return (<View style={authData.dark ? stylesDark.separator : styles.separator}/>)
      }}
        renderItem={(post) => {
        const item = post.item;
        return (
          <View style={authData.dark ? stylesDark.card : styles.card}>
            <View style={authData.dark ? stylesDark.imageContainer : styles.imageContainer}>
              {item.type != 'video' ? (
                <>
                <TouchableOpacity onLongPress={() => openModalDeleteMedia(item)} onPress={() => openModalImage(item)}>
                   <Image
                  style={authData.dark ? stylesDark.cardImage : styles.cardImage}
                  source={{uri: item.url}}
                  />
                </TouchableOpacity>
                
                </>
              ): <>
                <TouchableOpacity onLongPress={() => openModalDeleteMedia(item)} >
                  <Video
                    ref={video}
                    style={{height:150}}
                    source={{
                      uri: item.url,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                  />
                 
                </TouchableOpacity>
              </>}
             
            </View>
            <View style={authData.dark ? stylesDark.cardContent : styles.cardContent}> 
              {/* <Text style={styles.title}>{item.type}</Text>  */}
              {item.favorite ? (<>
              <IconButton onPress={() => setFavoriteMedia(item)} icon="star" size={20} color={authData.dark ? dark.colors.primary : light.colors.primary} style={authData.dark ? stylesDark.iconLike : styles.iconLike}/>
              </>) : <>
              <IconButton onPress={() => setFavoriteMedia(item)} icon="star-outline" size={20} color={authData.dark ? dark.colors.primary : light.colors.primary} style={authData.dark ? stylesDark.iconLike : styles.iconLike}/>
              </>}

              {item.tag ? (<>
              <IconButton onPress={() => openTagModal(item)} icon="tag-heart-outline" size={20} color={authData.dark ? dark.colors.primary : light.colors.primary} style={authData.dark ? stylesDark.iconTag : styles.iconTag}/>
              <Text>sad</Text>
              </>) : <>
              <IconButton onPress={() => openTagModal(item)} icon="tag-heart" size={20} color={authData.dark ? dark.colors.primary : light.colors.primary} style={authData.dark ? stylesDark.iconTag : styles.iconTag}/>
              <Text style={authData.dark ? stylesDark.textTag : styles.textTag}>{item.tags ? item.tags.join() : ''}</Text>
              </>}
               
             
            </View>
          </View>
        )
      }}/>

      {/* ------MODAL---- */}
      <View style={authData.dark ? stylesDark.containerModal : styles.containerModal}>
       <Modal
          backdropOpacity={0.3}
          isVisible={showStatusModal}
          onBackdropPress={closeModalStatus}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
            <IconButton onPress={() => openModalDeleteMedia2(imageData)} icon="delete" size={25} color={authData.dark ? dark.colors.primary : light.colors.primary} style={authData.dark ? stylesDark.iconLike : styles.iconLike}/>
            <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}> View Image </Text>
            <Image
                 style={{width: '100%', height:'75%'}}
                  source={{uri: imageData.url}}
                  resizeMode="contain"
                  />
            <Button mode="contained" onPress={closeModalStatus} style={authData.dark ? stylesDark.button : styles.button} >
                Close
            </Button>
          </View>
        </Modal>

        {/* <Modal
          backdropOpacity={0.3}
          isVisible={showDeleteModal}
          onBackdropPress={closeDeleteModal}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
             <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Delete Item ❌</Text>
            <Text style={{color: authData.dark ? dark.colors.text : light.colors.text}}>Are you sure to delete this item?</Text>
            <Button mode="contained" onPress={deleteMedia} style={authData.dark ? stylesDark.button : styles.button} >
                Ok
            </Button>
          </View>
        </Modal> */}

        <Portal>
        <Dialog visible={showDeleteModal} onDismiss={closeDeleteModal}>
          <Dialog.Title>Delete Item ❌</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure to delete this item?</Text>
          </Dialog.Content>
          <Dialog.Actions>
           
           <TouchableOpacity style={{backgroundColor: light.colors.accent, padding:10, marginHorizontal:5  }} onPress={closeDeleteModal} >
              <Text style={{color:'white'}}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: light.colors.primary, padding:10, marginHorizontal:5  }} onPress={deleteMedia} >
              <Text style={{color:'white'}}>YES</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

        <Modal
          backdropOpacity={0.3}
          isVisible={showTagModal}
          onBackdropPress={closeTagModal}
          style={authData.dark ? stylesDark.contentView : styles.contentView}
        >
          <View style={authData.dark ? stylesDark.content : styles.content}>
             <Text style={authData.dark ? stylesDark.contentTitle : styles.contentTitle}>Select Tag</Text>
            <Button mode="contained" onPress={() =>setTagsMedia('club')} style={authData.dark ? stylesDark.button : styles.button} >
                Club
            </Button>
             <Button mode="contained" onPress={() =>setTagsMedia('private')} style={authData.dark ? stylesDark.button : styles.button} >
                Private
            </Button>
          </View>
        </Modal>
        
      </View>
    

    </BackgroundHome>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 10
  },
  listContainer: {
    alignItems: 'center'
  },
  separator: {
    marginTop: 10
  },
  /******** card **************/
  card: {
    marginVertical: 8,
    backgroundColor: light.colors.background,
    flexBasis: '45%',
    marginHorizontal: 10
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between'
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: "#778899"
  },
  like: {
    fontSize: 20,
    flex: 1,
    color: light.colors.accent,
    position:'absolute',
    right:1,
    top: 15
    
  },
  iconLike: {
    flex: 1,
    position:'absolute',
    right:0,
    top: 10
  },
  iconTag: {
    flex: 1,
    position:'absolute',
    left:0,
    top: 10
  },
  textTag: {
    flex: 1,
    position:'absolute',
    left:35,
    top: 25,
    fontSize:10,
    color: light.colors.text
  },
  appBarTitle: {
    color: light.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
   contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: light.colors.modalBackground,
    padding: 15,
    justifyContent:'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: light.colors.text
  },
});


const stylesDark = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 10
  },
  listContainer: {
    alignItems: 'center'
  },
  separator: {
    marginTop: 10
  },
  /******** card **************/
  card: {
    marginVertical: 8,
    backgroundColor: dark.colors.background,
    flexBasis: '45%',
    marginHorizontal: 10
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between'
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: "#778899"
  },
  like: {
    fontSize: 20,
    flex: 1,
    color: dark.colors.accent,
    position:'absolute',
    right:1,
    top: 15
    
  },
  iconLike: {
    flex: 1,
    position:'absolute',
    right:0,
    top: 10
  },
  iconTag: {
    flex: 1,
    position:'absolute',
    left:0,
    top: 10
  },
  textTag: {
    flex: 1,
    position:'absolute',
    left:35,
    top: 25,
    fontSize:10,
    color: dark.colors.text
  },
  appBarTitle: {
    color: dark.colors.appBarTitleColor,
    fontWeight: 'bold'
  },
   contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: dark.colors.modalBackground,
    padding: 15,
    justifyContent:'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: dark.colors.text
  },
});