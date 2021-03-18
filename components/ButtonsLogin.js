import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';

const ButtonsLogin = ({ goBack }) => (
  <View>
    
    <View style={styles.container}>
        <IconButton onPress={goBack} style={styles.iconButton} color={Colors.white} icon="apple" size={30} />
        <IconButton onPress={goBack} style={styles.iconButton} color={Colors.white} icon="facebook" size={30} />
        <IconButton onPress={goBack} style={styles.iconButton} color={Colors.white} icon="google" size={30} />
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
        backgroundColor: '#050708',
    }
});

export default memo(ButtonsLogin);