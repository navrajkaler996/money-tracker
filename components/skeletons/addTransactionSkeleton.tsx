import React from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/utils/constants";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AddTransactionSkeleton = () => {
  // Animated fade for loading effect
  const fadeAnim = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.leftContainer} />

        <View style={styles.rightContainer} />
      </Animated.View>

      <View style={styles.formContainer}>
        <View style={styles.amountContainer}></View>

        <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.gradient}></LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    width: windowWidth,
    height: windowHeight * 0.12,
    backgroundColor: COLORS["primary-1"],
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
    zIndex: 10000,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    flex: 2,
  },
  rightContainer: {
    flex: 1,
  },
  formContainer: {
    width: windowWidth,
    height: windowHeight * 0.85,
    marginTop: windowHeight * 0.15,
    alignItems: "center",
  },
  gradient: {
    width: windowWidth,
    height: "100%",
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  amountContainer: {
    flex: 4,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonBox: {
    width: windowWidth * 0.8,
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
  },
  bottomContainer: {
    flex: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 40,
  },
  tab: {
    width: windowWidth * 0.25,
    height: 40,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  optionsContainer: {
    flex: 8,
    marginTop: 30,
    width: windowWidth * 0.8,
  },
  skeletonDropdown: {
    width: "100%",
    height: 40,
    backgroundColor: "#ddd",
    marginBottom: 20,
    borderRadius: 8,
  },
  skeletonButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 25,
    marginTop: 40,
  },
});

export default AddTransactionSkeleton;
