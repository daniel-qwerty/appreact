import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';




const Header = ({ children, props }) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 26,

    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

export default memo(Header);