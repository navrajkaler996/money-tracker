import { COLORS } from "@/utils/constants";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface InputProps {
  label: string;
  placeholder: string;
  numeric?: boolean;
  onChangeText: (text: string) => void;
  error?: string | null;
  value: string;
  textInputStyles?: TextStyle;
  editable: Boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  numeric = false,
  onChangeText,
  error,
  value,
  textInputStyles,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={
          error
            ? [styles.textInput, { borderBottomColor: COLORS.error }]
            : !editable
            ? [
                styles.textInput,
                textInputStyles,
                { backgroundColor: COLORS.disabled },
              ]
            : [styles.textInput, textInputStyles]
        }
        placeholder={placeholder}
        keyboardType={numeric ? "numeric" : "default"}
        onChangeText={(text) => onChangeText(text)}
        value={String(value)}
        editable={editable}
      />
      <Text style={styles.error}>{error}</Text>
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
    paddingLeft: 5,
    textTransform: "lowercase",
    fontFamily: "Aller_Rg",
    letterSpacing: 0.3,
  },
  error: { fontSize: 12, color: COLORS.error },
});

export default Input;
