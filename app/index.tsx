import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.content}>
            <Text style={{ fontFamily: "Aller_Bd" }}>asdsadas</Text>
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

    // Shadow styles for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
  },
  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
