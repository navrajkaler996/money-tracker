import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/utils/constants";
import SettingOne from "./settingOne";
import SettingTwo from "./settingTwo";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function NewUserScreen({ navigation }: any) {
  const [setting, setSetting] = useState(1);
  const [activeAccount, setActiveAccount] = useState("");

  // State for categories
  const [categories, setCategories] = useState([
    "Grocery",
    "Transport",
    "Dining",
    "Entertainment",
    "Health",
    "Others",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState(""); // State for the new category input

  const [accounts, setAccounts] = useState<string[]>([]);

  const handleSetting = () => {
    let tempsSetting = setting === 3 ? 1 : setting + 1;
    setSetting(tempsSetting);
  };

  const handleAccounts = (activeAccount: any) => {
    setActiveAccount(activeAccount);
  };

  const handleCategory = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter((item) => item !== category);
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory("");
      setShowAddCategory(false);
      setSelectedCategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        newCategory,
      ]);
    } else {
      alert("Please enter a valid, unique category.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Gradient with Heading */}
      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.heading1Container}>
            <Text style={styles.heading1}>Set up your activeAccount</Text>
          </View>
          <Image
            style={styles.setupImage}
            source={require("../assets/images/icons/setup.png")}
          />
        </LinearGradient>
      </View>

      {/* Category Selection Container */}
      <View
        style={{ ...styles.getStartedOuterContainer, ...styles.cardShadow }}>
        <LinearGradient
          colors={["#a8ff78", "#78ffd6"]}
          style={styles.getStartedContainer}>
          <Text style={styles.heading2}>
            {setting === 1
              ? `Select categories`
              : setting === 2
              ? `Select accounts`
              : `Set Budget`}
          </Text>
          <View style={styles.horizontalLine} />
          {/* Category capsules */}
          {setting === 1 && (
            <SettingOne
              categories={categories}
              selectedCategories={selectedCategories}
              handleCategory={handleCategory}
              showAddCategory={showAddCategory}
              setShowAddCategory={setShowAddCategory}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              handleAddCategory={handleAddCategory}
            />
          )}
          {setting === 2 && (
            <SettingTwo
              activeAccount={activeAccount}
              handleAccounts={handleAccounts}
              accounts={accounts}
              setAccounts={setAccounts}
            />
          )}
          <View style={styles.buttonContainer}>
            <View style={styles.dotIndicatorContainer}>
              <View
                style={
                  setting === 1
                    ? { ...styles.dotIndicator, ...styles.activeDot }
                    : styles.dotIndicator
                }></View>
              <View
                style={
                  setting === 2
                    ? { ...styles.dotIndicator, ...styles.activeDot }
                    : styles.dotIndicator
                }></View>
              <View
                style={
                  setting === 3
                    ? { ...styles.dotIndicator, ...styles.activeDot }
                    : styles.dotIndicator
                }></View>
            </View>
            <Pressable style={styles.button} onPress={handleSetting}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  gradientContainer: {
    width: windowWidth,
    elevation: 5,
  },
  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.35,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  getStartedOuterContainer: {
    marginTop: -100,
  },
  getStartedContainer: {
    width: windowWidth * 0.8,
    minHeight: windowHeight * 0.5,
    borderRadius: 25,
    alignItems: "center",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
    borderRadius: 10,
  },
  heading1Container: {
    marginTop: 50,
  },
  heading1: {
    textAlign: "center",
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    fontSize: 24,
  },
  heading2: {
    textAlign: "center",
    fontFamily: "Aller_Bd",
    textTransform: "capitalize",
    letterSpacing: 0.5,
    marginTop: 10,
    fontSize: 20,
  },
  horizontalLine: {
    width: "80%",
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 15,
    marginBottom: 15,
  },
  categoryCapsuleContainer: {
    width: windowWidth * 0.7,
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
    backgroundColor: COLORS["primary-3"],
    borderRadius: 20,
    justifyContent: "center",
  },
  categoryCapsuleActive: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
  },
  categoryCapsuleText: {
    color: "#000",
    fontFamily: "Aller_Rg",
  },

  dotIndicatorContainer: {
    flexDirection: "row",
    width: windowWidth,
    justifyContent: "center",
    gap: 10,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: COLORS["primary-3"],
  },
  activeDot: {
    backgroundColor: COLORS["primary-4"],
  },
  setupImage: {
    marginTop: 30,
  },
  button: {
    width: windowWidth * 0.7,
    height: 40,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    gap: 20,
    alignItems: "center",
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
  form: {
    marginTop: 20,
    alignItems: "center",
    gap: 15,
  },
  buttonCash: {
    width: windowWidth * 0.3,
    height: 30,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextCash: {
    fontSize: 12,
    textTransform: "capitalize",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
});

export default NewUserScreen;
