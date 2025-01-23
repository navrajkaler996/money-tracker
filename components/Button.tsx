import { COLORS, STYLES } from "@/utils/constants";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Button = ({ text, buttonStyles, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, STYLES.SHADOW_1, buttonStyles]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: windowWidth * 0.8,
    height: 50,
    backgroundColor: COLORS["primary-3"],
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    textTransform: "capitalize",
    fontSize: 16,
    fontFamily: "Aller_Rg",
    letterSpacing: 0.3,
  },
});

export default Button;
