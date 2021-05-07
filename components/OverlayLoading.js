import React, { memo } from 'react';
import { Modal, View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import {Title, Surface} from 'react-native-paper';
import {dark} from '../utils/theme'
import Logo from '../components/Logo';

const OverlayLoading = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible} transparent={true}>
    <View style={{ flex: 1, backgroundColor:'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}> 
      <Surface style={{ borderRadius: 10, backgroundColor: dark.colors.primary, padding: 35, elevation:12 }}>
        <Title style={{ fontSize: 20, fontWeight: '200', marginBottom:20 }}>Loading</Title>
        <ActivityIndicator size="large" color='white' />
      </Surface>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.6)', 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height:'100%',
    zIndex:9999999,
    position:'absolute',
  },
  
});

export default memo(OverlayLoading);