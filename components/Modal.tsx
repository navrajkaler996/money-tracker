import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function ModalContainer() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Button to open the modal */}

      {/* Modal component */}
      <Modal
        animationType="slide" // 'fade', 'slide', 'none'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Android back button handler
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>This is a Modal</Text>
            <Button
              title="Close Modal"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: windowHeight * 0.5,
    width: windowWidth * 0.5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
});
