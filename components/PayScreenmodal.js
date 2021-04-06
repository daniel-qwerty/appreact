import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text} from "react-native";
import Modal from 'react-native-modal';
import { Button, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default PayScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
   setModalVisible(true)
  }, []);
  return (
    <>
     
     <IconButton onPress={() => setModalVisible(true)}  icon="facebook" size={30} />
      <View style={styles.container}>
        <Modal
          backdropOpacity={0.3}
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.contentView}
        >
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Hi 👋!</Text>
            <Text>Hello from Overlay!</Text>
          </View>
        </Modal>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
	buttonStyle: {
    height: 90,
    width: 90,
    backgroundColor: 'black',
    borderRadius: 100
  }
});