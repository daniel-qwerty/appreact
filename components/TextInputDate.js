import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, IconButton } from 'react-native-paper';
import {theme} from '../utils/theme'


// type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInputForDate = ({ errorText, ...props }) => (
  <View style={styles.container}>
    
    <Input
      style={styles.input}
      underlineColor="transparent"
      mode="outlined"   
      {...props}
    />
    <IconButton color={theme.colors.primary} icon="calendar" size={30} style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }} />
    
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: 'white',
    height:40,
    paddingRight: 50
   
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInputForDate);