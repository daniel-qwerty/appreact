import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IconButton, Button } from 'react-native-paper';
import {theme} from '../utils/theme'

const OnlyFansButton = ({ Press }) => (
  <TouchableOpacity onPress={Press} style={styles.container}>
    <Text>OnlyFans</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 0,
    borderColor:theme.colors.primary,
    borderRadius:15,
    borderWidth:1,
    padding:10,

  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(OnlyFansButton);