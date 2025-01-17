// CategoryCapsules.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/utils/constants"; // Assuming COLORS is being imported from a constants file

const categories = [
  "Grocery",
  "Transport",
  "Dining",
  "Entertainment",
  "Health",
  "Others",
];

const SettingOne = () => {
  return (
    <View style={styles.categoryCapsuleContainer}>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryCapsule}>
          <Text style={styles.categoryCapsuleText}>{category}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryCapsuleContainer: {
    width: "70%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  categoryCapsule: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["primary-3"], // Assuming "primary-3" is defined in your COLORS
    borderRadius: 20,
  },
  categoryCapsuleText: {
    color: "#000",
    fontFamily: "Aller_Rg", // Assuming you are using a custom font
  },
});

export default SettingOne;
