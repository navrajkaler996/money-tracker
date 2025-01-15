import { COLORS } from "@/utils/constants";
import { Tabs } from "expo-router/tabs";
import { Image, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS["primary-3"],
        headerStyle: {
          backgroundColor: "#a8ff78",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icons/home.png")}
              style={{
                width: size,
                height: size,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icons/setting.png")}
              style={{
                width: size,
                height: size,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icons/setting.png")}
              style={{
                width: size,
                height: size,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
