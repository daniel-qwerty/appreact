import React, { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const ProfileImage = ({ errorText, ...props }) => (
    <Image
     style={styles.image} 
      {...props}
    />
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  
  image: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 65
  }, 
  
});

export default memo(ProfileImage);