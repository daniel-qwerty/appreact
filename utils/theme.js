import { DefaultTheme } from 'react-native-paper';

export const theme = {
   ...DefaultTheme,
 roundness: 15,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    text:'#121212',
    inputBackground:'white',
    modalBackground:'white',
    primary: '#e40082',
    accent: '#252635',
    likeMessageColor: '#FF3C9C',
    appBarTitleColor: '#FFFFFF',  
    appBarIconColor: '#FFFFFF',  
  },
};

export const light = {
   ...DefaultTheme,
 roundness: 15,
 
  colors: {
    ...DefaultTheme.colors,
    notification: 'white',
    background: 'white',
    text:'#121212',
    inputBackground:'white',
    modalBackground:'white',
    primary: '#e40082',
    accent: '#2D2D2D',
    likeMessageColor: '#FF3C9C',
    appBarTitleColor: '#FFFFFF',  
    appBarIconColor: '#FFFFFF',  
  },
};

export const dark = {
   ...DefaultTheme,
 roundness: 15,
 
  colors: {
    ...DefaultTheme.colors,
    notification: 'white',
    background: '#1e1e2a',
    text:'white',
    inputBackground:'#26272B',
    modalBackground:'#252635',
    primary: '#e40082',
    accent: '#252635',
    likeMessageColor: '#FF3C9C',
    appBarTitleColor: '#FFFFFF',  
    appBarIconColor: '#FFFFFF',  
  },
};



