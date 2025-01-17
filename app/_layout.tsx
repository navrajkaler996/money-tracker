import { Redirect, Slot, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Toast, { BaseToast } from "react-native-toast-message";

import { useFonts } from "expo-font";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { AuthProvider } from "@/context/AuthContext";
import { COLORS } from "@/utils/constants";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS["primary-3"],
        backgroundColor: COLORS["primary-1"],
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
        fontFamily: "Aller_Bd",
      }}
    />
  ),
};

export default function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="transactionOptions/transactionList"
            options={{ headerShown: false }}
          />
        </Stack>
        <Toast config={toastConfig} />
      </Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8ff78",
  },
});
