import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { COLORS, STYLES } from "@/utils/constants";

interface CircularButtonProps {
  onPress: any;
}

const CircularButton: React.FC<CircularButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={[styles.add, STYLES.SHADOW_1]} onPress={onPress}>
      <Image
        source={require("../assets/images/icons/add-icon.png")}
        style={styles.addIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  add: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLORS["primary-3"],
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    width: 30,
    height: 30,
  },
});

export default CircularButton;
