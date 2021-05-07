import firebase from 'firebase';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';  

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

