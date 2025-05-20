import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import Input from "@/components/Input";
import Button from "@/components/Button";
import RadioGroup from "@/components/RadioGroup";

import { COLORS, DAYS } from "@/utils/constants";
import { Dropdown } from "react-native-element-dropdown";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const incomeType = ["monthly", "biweekly"];

const addIncome = () => {
  const router = useRouter();
  const { account: accountInParams, userId } = useLocalSearchParams();

  const account = JSON.parse(accountInParams as string);

  const [selectedIncomeType, setSelectedIncomeType] = useState("monthly");

  //Rendering labels for dropdowns
  const renderLabel = (label: string) => {
    return <Text style={[styles.label]}>{label}</Text>;
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}>
        <View style={styles.header}>
          <Pressable style={styles.leftContainer}>
            <Image
              source={require("../../assets/images/icons/back.png")}
              style={styles.goBackImage}
            />
          </Pressable>

          <Text style={styles.headerText}>Income</Text>

          <View style={styles.rightContainer}></View>
        </View>

        <View style={styles.formContainer}>
          <Input
            label={"Bank name"}
            numeric={true}
            value={account.bank_name}
            error={undefined}
            editable={false}
          />
          <Input
            label={"Account type"}
            numeric={true}
            value={account.account_type}
            error={undefined}
            editable={false}
          />

          <RadioGroup
            label={"Income type"}
            values={incomeType}
            selected={selectedIncomeType}
            onSelected={setSelectedIncomeType}
          />

          <Input
            label={"Income amount"}
            numeric={true}
            value={account.total_amount}
            error={undefined}
          />

          {renderLabel("Select a day ")}
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={DAYS}
            onChange={function (item: any): void {}}
            maxHeight={300}
            labelField={"label"}
            valueField={"value"}
          />

          {/* {selectedAccountType === "credit" && (
                <Input
                  label={"Available credit"}
                  placeholder={"Enter available credit"}
                  numeric={true}
                  onChangeText={setAvailableCredit}
                  value={availableCredit}
                  error={undefined}
                />
              )} */}
          {/* {selectedAccountType === "credit" && (
                <Input
                  label={"Credit limit"}
                  placeholder={"Enter credit limit"}
                  numeric={true}
                  onChangeText={setCreditLimit}
                  value={creditLimit}
                  error={undefined}
                />
              )} */}

          <Button
            text="Setup Income"
            buttonStyles={{ marginTop: 10, marginBottom: 30 }}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    width: windowWidth,
    height: windowHeight * 0.12,
    backgroundColor: COLORS["primary-1"],
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
    zIndex: 10000,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButton: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Aller_Bd",
  },
  headerText: {
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    fontSize: 18,
    color: "#000",
    flex: 2,
    textAlign: "center",
  },
  rightContainer: {
    flex: 1,
  },
  goBackImage: {
    width: 30,
    height: 30,
  },
  formContainer: {
    width: windowWidth * 0.8,
    marginTop: windowHeight * 0.15,

    // alignItems: "center",
    gap: 15,
  },
  transactionsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  arrow: {
    width: 30,
    height: 30,
    alignSelf: "flex-end",
  },
  transactionHeading: {
    textAlign: "center",
    fontFamily: "Aller_Rg",
    fontSize: 20,
    marginBottom: 20,
  },
  incomeContainer: {
    flexDirection: "row",
    // alignSelf: "flex-start",
    width: windowWidth * 0.8,
    alignItems: "center",
  },
  incomeImage: {
    width: 25,
    height: 25,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  incomeText: {
    fontFamily: "Aller_Rg",
  },
  dropdown: {
    height: 40,
    borderColor: "#DDD",
    borderBottomWidth: 0.5,
    paddingLeft: 5,
    color: "#000",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#000",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: { fontFamily: "Aller_Rg", fontSize: 16 },
});

export default addIncome;
