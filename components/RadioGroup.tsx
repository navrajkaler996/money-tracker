import { StyleSheet, Text, View } from "react-native";

import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { COLORS } from "@/utils/constants";

const RadioGroup = ({ values, selected, onSelected }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account type</Text>
      <RadioButtonGroup
        containerStyle={styles.radioButtonGroup}
        selected={selected}
        onSelected={(value: string) => onSelected(value)}
        radioBackground={COLORS["primary-1"]}>
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
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 14,
    textTransform: "capitalize",
  },
});

export default RadioGroup;
