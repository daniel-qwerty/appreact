import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import {theme} from '../utils/theme'

const ButtonsLogin = ({ ...props }) => (
  <View>
    
    <View style={styles.container}>
        <IconButton {...props} style={styles.iconButton} color={Colors.white} icon="facebook" size={30} />
        <IconButton {...props} style={styles.iconButton} color={Colors.white} icon="instagram" size={30} />
        
    </View>
     
  </View>
);

const styles = StyleSheet.create({
    label: {
        fontWeight:'bold'
    },
        container: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10
    },
    iconButton: {
        backgroundColor: theme.colors.accent,
    }
});

export default memo(ButtonsLogin);