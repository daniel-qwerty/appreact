import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import BackgroundHome from '../components/BackgroundHome'
import Header from '../components/Header'
import BackButton from '../components/BackButton';

export default function TermsCoditionsScreen({navigation}) {
  return (
    <BackgroundHome>
      <BackButton goBack={() => navigation.goBack()}/>
      <View style={styles.container}>
        <Header>Terms and Conditions</Header>

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
    marginVertical: 50
  },
  paragraphText: {
    textAlign: 'left',
    fontSize: 12,
    lineHeight: 26,

    marginBottom: 14
  }
});
