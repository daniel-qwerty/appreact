import React, { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import {theme} from '../utils/theme'
import {Appbar} from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';


const Header = ({ children, props }) => (
  <Appbar.Header {...props} style={{width:'100%',}}>
    {children}
     <Appbar.Action color={theme.colors.appBarIconColor} icon="crown" onPress={() => { WebBrowser.openBrowserAsync('https://www.onlyfans.com')}} />
  </Appbar.Header>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

export default memo(Header);