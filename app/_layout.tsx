import { Redirect, Slot, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useFonts } from "expo-font";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store";

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
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8ff78",
  },
});
