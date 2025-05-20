import { Dimensions, StyleSheet, Text, View } from "react-native";

import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { COLORS } from "@/utils/constants";
const windowWidth = Dimensions.get("window").width;

const RadioGroup = ({
  values,
  selected,
  onSelected,
  radioGroupStyles,
  containerStyles,
  radioButtonColor = COLORS["primary-1"],
  label = null,
}) => {
  return (
    <View style={{ ...styles.container, ...containerStyles }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RadioButtonGroup
        containerStyle={{ ...styles.radioButtonGroup, ...radioGroupStyles }}
        selected={selected}
        onSelected={(value: string) => onSelected(value)}
        radioBackground={radioButtonColor}>
        {values?.length > 0 &&
          values?.map((value: any) => {
            return (
              <RadioButtonItem
                value={value}
                label={<Text style={styles.radioLabel}>{value}</Text>}
              />
            );
          })}
      </RadioButtonGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 15,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },

  label: { fontFamily: "Aller_Rg", fontSize: 16 },
  radioButtonGroup: {
    gap: 10,
    // flexDirection: "row",
    // width: windowWidth * 0.8,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 14,
    textTransform: "capitalize",
  },
});

export default RadioGroup;
