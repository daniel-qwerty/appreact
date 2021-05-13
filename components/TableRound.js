import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { dark, light, theme } from '../utils/theme';
import AuthContext from '../auth/context'

 export default function TableRound({mode, style, children, ...props }) { 

  const {authData, setAuthData} = useContext(AuthContext)
  const [showText, setShowText] = useState(true);

  useEffect(() => {
   
    //getEntertainerFacility();
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText((showText) => !showText);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return(
    // <PaperButton
    //   style={[
    //     styles.button,
    //     mode === 'outlined' ,
    //     style,
    //   ]}
    //   labelStyle={authData.dark? stylesDark.text : styles.text}
    //   mode={mode}
    //   {...props}
    // >
    //   {children}
    // </PaperButton>

    <TouchableOpacity
            style={[
            styles.item, {
              backgroundColor: showText
                ? theme.colors.primary
                : theme.colors.accent
            }
          ]}
          
            // onPress={() => navigation.navigate('Table', {club: myFacility.id, table:item.table})}
            {...props}>
            <Text
              style={[
              styles.itemText, {
                backgroundColor: showText
                  ? theme.colors.primary
                  : theme.colors.accent
              }
            ]}>8</Text>

          </TouchableOpacity>
  )
  
 }

const styles = StyleSheet.create({
  item: {
    backgroundColor: light.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  
  itemText: {
    color: '#fff',
    backgroundColor: light.colors.accent,
    fontSize: 10
  },
});

const stylesDark = StyleSheet.create({
  item: {
    backgroundColor: dark.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 0,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  
  itemText: {
    color: '#fff',
    backgroundColor: dark.colors.accent,
    fontSize: 10
  },
});

