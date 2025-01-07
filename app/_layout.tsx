import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function AppLayout() {
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
