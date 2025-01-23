import { COLORS } from "@/utils/constants";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Dropdown as ReactNativeDropdown } from "react-native-element-dropdown";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Dropdown = ({ data, label, handleDropdown }) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = (label: string) => {
    return <Text style={[styles.label]}>{label}</Text>;
  };

  return (
    <View style={styles.container}>
      {renderLabel(label)}
      <ReactNativeDropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        onChange={(value) => {
          handleDropdown(value.value);
        }}
        maxHeight={300}
        labelField={"label"}
        valueField={"value"}
        onFocus={() => setIsFocus(true)}></ReactNativeDropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    height: 40,
    width: windowWidth * 0.8,
    borderColor: COLORS["primary-3"],
    borderBottomWidth: 1,

    color: "#000",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#000",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: {
    zIndex: 999,

    fontSize: 16,
    fontFamily: "Aller_Rg",
  },
});

export default Dropdown;
