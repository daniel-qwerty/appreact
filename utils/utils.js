import firebase from 'firebase';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';  
import AsyncStorage from '@react-native-async-storage/async-storage';

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;
  
  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';
  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';
  return '';
};

export const latNameValidator = (latName) => {
  if (!latName || latName.length <= 0) return 'Last Name cannot be empty.';
  return '';
};

export const descriptionValidator = (description) => {
  if (!description || description.length <= 0) return 'Description cannot be empty.';
  return '';
};

export const phoneValidator = (phone) => {
  if (!phone || phone.length <= 0) return 'Phone cannot be empty.';
  return '';
};

export const facilityValidator = (facility) => {
  if (!facility || facility.length <= 0) return 'Facility cannot be empty.';
  return '';
};

export const uploadImageAsync = async (uri, directory, name) =>{
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
   
    const ref = firebase
      .storage()
      .ref()
      .child(`${directory}/${name}`);
    const snapshot = await ref.put(blob);



    blob.close();
    return await snapshot.ref.getDownloadURL();
  }

  export const deleteFileFromStorage = async (directory, name) =>{
     const ref = firebase
      .storage()
      .ref()
      .child(`${directory}/${name}`);
    // Delete the file
    ref.delete().then(function() {
      // File deleted successfully
      console.log('file deleted from storage')
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  }

  export const compressImage = async (uri, size, format = SaveFormat.JPEG) => { // SaveFormat.PNG
    const result = await manipulateAsync(
        uri,
        [{ resize: { width: size } }],
        { compress: 0.3, format }
    );

    return  { name: `${Date.now()}.${format}`, type: `image/${format}`, ...result };
    // return: { name, type, width, height, uri }
  };

  export const saveToCache = async (name, data, hours) => { 
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var value = {data: data, expires: `${year}-${month}-${day}`}
    await AsyncStorage.setItem(name, JSON.stringify(value))
   // return  value
    // return: { name, type, width, height, uri }
  };

  export const checkToCache = async (name) => { 
    await AsyncStorage.getItem(name) .then(function(result) {
          if(result) {
            
              let data = JSON.parse(result)
              var dateObj = new Date();
              var now = `${dateObj.getUTCFullYear()}-${dateObj.getUTCMonth() + 1}-${dateObj.getUTCDate()}`
              if(now === data.expires){
                return(true); //valid cache
              } else {
                return(false); // no valid cache
              }
          } else {
            console.log('dasdasdas');
            return(false);
          }
      })
      .catch(() => {
          console.log('no esta en cache');
          return(false);
      })
  };

  export const getDistance  = (lon1, lat1, lon2, lat2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return (d * 1000);
  }

   /** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
