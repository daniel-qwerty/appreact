import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//  let Props = {
//   children: React.ReactNode
// };

const BackgroundHome = ({ children, Props }) => (
  <ImageBackground
    source={require('../assets/images/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}
  >
    <SafeAreaView style={{  height: '100%',}}>
         <ScrollView style={{  height: '100%',}}>
           <KeyboardAvoidingView style={styles.container} >
      
         {children}
      
    </KeyboardAvoidingView>
         </ScrollView>
    
    </SafeAreaView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    padding: 0,
    width: '100%',
    maxWidth: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(BackgroundHome);