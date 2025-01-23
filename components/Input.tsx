import { COLORS } from "@/utils/constants";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Input = ({ label, placeholder, numeric, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        keyboardType={numeric ? "numeric" : "default"}
        onChangeText={(text) => onChangeText(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "column", gap: 5 },
  label: { fontFamily: "Aller_Rg", fontSize: 16 },
  textInput: {
    width: windowWidth * 0.8,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    height: 40,
    fontSize: 14,
  },
});

export default Input;
