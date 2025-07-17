import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { router, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function SettingsScreen({ navigation }: any) {
  const { user, token } = useAuth(); // Include checkToken from AuthContext

  const router = useRouter();

  // Token validation on mount
  // useEffect(() => {
  //   const handleCheckToken = async () => {
  //     const isValid = await checkToken();
  //     if (isValid) {
  //       console.log("Token is valid, user remains logged in");
  //     } else {
  //       // Clear stored data if token is invalid
  //       await SecureStore.deleteItemAsync("token");
  //       await SecureStore.deleteItemAsync("userId");
  //       await SecureStore.deleteItemAsync("email");
  //       console.log("Token is expired or not found, redirecting to login");
  //       router.replace("/login"); // Redirect to login screen
  //     }
  //   };
  //   handleCheckToken();
  // }, [checkToken]);

  // Logout function
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("email");
      console.log("User logged out successfully");
      router.push({
        pathname: "/",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={["#a8ff78", "#78ffd6"]}
          style={styles.headerGradient}>
          <Image
            source={require("../../assets/images/icons/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.nameText}>{user.first_name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </LinearGradient>
      </View>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.logoutButtonGradient}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerGradient: {
    width: "100%",
    minHeight: windowHeight * 0.6,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  nameText: {
    fontFamily: "Aller_Bd", // Assuming consistent font from CategoryScreen
    fontSize: 24,
    color: "#333",
    textTransform: "capitalize",
    marginBottom: 5,
  },
  emailText: {
    fontFamily: "Aller_Rg", // Assuming consistent font
    fontSize: 16,
    color: "#555",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoutButton: {
    width: windowWidth * 0.6,
    borderRadius: 20,
    overflow: "hidden",
  },
  logoutButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontFamily: "Aller_Rg",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    color: "#000",
  },
});

export default SettingsScreen;
