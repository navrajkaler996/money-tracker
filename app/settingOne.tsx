import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import { COLORS } from "@/utils/constants";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface SettingOneProps {
  categories: string[];
  selectedCategories: string[];
  handleCategory: (category: string) => void;
  showAddCategory: boolean;
  setShowAddCategory: (value: boolean) => void;
  newCategory: string;
  setNewCategory: (value: string) => void;
  handleAddCategory: () => void;
}

const SettingOne = ({
  categories,
  selectedCategories,
  handleCategory,
  showAddCategory,
  setShowAddCategory,
  newCategory,
  setNewCategory,
  handleAddCategory,
}: SettingOneProps) => {
  return (
    <View style={styles.categoryCapsuleContainer}>
      {categories.map((category, index) => (
        <Pressable
          key={index}
          style={
            selectedCategories?.includes(category)
              ? styles.categoryCapsuleActive
              : styles.categoryCapsule
          }
          onPress={() => handleCategory(category)}>
          <Text style={styles.categoryCapsuleText}>{category}</Text>
        </Pressable>
      ))}
      <Pressable
        style={
          showAddCategory
            ? styles.categoryCapsuleActive
            : styles.categoryCapsule
        }
        onPress={() => setShowAddCategory(!showAddCategory)}>
        <Text style={styles.categoryCapsuleText}>add+</Text>
      </Pressable>
      {showAddCategory && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter category name"
            placeholderTextColor="#666"
            value={newCategory}
            onChangeText={setNewCategory} // Update newCategory state as user types
          />
          <Pressable style={styles.buttonCategory} onPress={handleAddCategory}>
            <Text style={styles.buttonTextCategory}>Add category</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryCapsuleContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  categoryCapsule: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["primary-3"],
    borderRadius: 20,
  },
  categoryCapsuleActive: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["active-yellow"],
    borderRadius: 20,
  },
  categoryCapsuleText: {
    color: "#000",
    fontFamily: "Aller_Rg",
  },
  form: {
    marginTop: 20,
    alignItems: "center",
    gap: 15,
  },
  input: {
    width: windowWidth * 0.7,
    height: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#ccc",
    fontSize: 16,
    backgroundColor: "transparent",
    paddingLeft: 10,
  },
  buttonCategory: {
    width: windowWidth * 0.3,
    height: 30,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextCategory: {
    fontSize: 12,
    textTransform: "capitalize",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
});

export default SettingOne;
