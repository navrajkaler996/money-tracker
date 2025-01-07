import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useFonts } from "expo-font";
import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function AppLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },

          headerTitleStyle: {
            fontFamily: "Aller_Bd",
            color: "#000",
          },
        }}>
        <Stack.Screen name="index" options={{ title: "My App" }} />
        {/* Add other Stack.Screen components here for top-level routes if needed */}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8ff78",
  },
});
