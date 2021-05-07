import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IconButton } from 'react-native-paper';
import {dark, light} from '../utils/theme'
import AuthContext from '../auth/context'

// type Props = {
//   goBack: () => void;
// };


 export default function BackButton({goBack}) { 

  const {authData, setAuthData} = useContext(AuthContext)
  
  return(
    <TouchableOpacity onPress={goBack} style={styles.container}>
      {/* <Image style={styles.image} source={require('../assets/images/arrow_back.png')} /> */}
      <IconButton color={authData.dark? dark.colors.text : light.colors.text} icon="arrow-left-circle" size={24} />
    </TouchableOpacity>
  )
  
 }

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 ,
    left: 0,
  },
  image: {
    width: 24,
    height: 24,
  },
});
