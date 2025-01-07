import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";

export default function AppLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LinearGradient colors={["#a8ff78", "#a8ff78"]} style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent", // Make header background transparent
          },
          headerTintColor: "#fff", // Optional: Set header text color to contrast with gradient
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}>
        <Stack.Screen name="index" options={{ title: "My App" }} />
        {/* Add other Stack.Screen components here for top-level routes if needed */}
      </Stack>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
