import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IconButton } from 'react-native-paper';

const FilterButton = ({ Press }) => (
  <TouchableOpacity onPress={Press} style={styles.container}>
    <IconButton icon="calendar-search" size={24} style={styles.image} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    right: 0,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(FilterButton);