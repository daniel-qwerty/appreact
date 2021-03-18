import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { theme } from '../utils/theme';

const DropDownList = ({ ...props }) => (
  
   
    <DropDownPicker
      style={styles.input}
      dropDownStyle={{backgroundColor: theme.colors.primary}}
      {...props}
    />
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15, borderTopRightRadius: 15,
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
    borderColor: 'gray',
    marginVertical: 5,
    height:40
  },
  
});

export default memo(DropDownList);