import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import BackgroundHome from '../components/BackgroundHome'
import Header from '../components/Header'
import BackButton from '../components/BackButton';

export default function TermsServicesScreen({navigation}) {
  return (
    <BackgroundHome>
      
      <View style={styles.container}>
        <BackButton goBack={() => navigation.goBack()}/>
        <Text style={{fontSize: 26,fontWeight: 'bold',marginTop: 50,}}>Terms of Service</Text>

        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>
        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>
        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>

        <Text style={{fontSize: 26,fontWeight: 'bold',paddingVertical: 14,}}>Privacy Policy</Text>

        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>
        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>
        <Text style={styles.paragraphText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat arcu
          in massa malesuada pellentesque. Aliquam ligula nisl, pharetra non interdum et,
          bibendum vitae urna. Aliquam tristique arcu ligula, eleifend aliquet nunc
          aliquet eget. Etiam tempus quam urna, vel fermentum est rutrum eget. Morbi sit
          amet urna molestie, congue ante vulputate, rhoncus mi. Donec erat tortor,
          ultricies ac velit vel, gravida pharetra neque. Nam tellus leo, consectetur eget
          tincidunt ac, fermentum eget mauris.
        </Text>
      </View>
    </BackgroundHome>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    width:'85%',
    height:'100%'
  },
  paragraphText: {
    textAlign: 'left',
    fontSize: 12,
    lineHeight: 26,

    marginBottom: 14
  }
});
