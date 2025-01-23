import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Input from "@/components/Input";

import { COLORS } from "@/utils/constants";
import RadioGroup from "@/components/RadioGroup";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useInsertAccountsMutation } from "@/services/accountApi";
import { useNavigation, useRouter } from "expo-router";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const addAccount = () => {
  const accountTypes = ["debit", "credit", "cash"];
  const bankNames = [{ value: "RBC", label: "RBC" }];

  const router = useRouter();

  //API for inserting accounts
  const [
    insertAccounts,
    {
      isLoading: insertAccountsIsLoading,
      error: insertAccountsError,
      data: insertAccountsData,
    },
  ] = useInsertAccountsMutation();

  const [selectedAccountType, setSelectedAccountType] = useState("debit");
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);

  useEffect(() => {
    if (!insertAccountsIsLoading && insertAccountsData) {
      router.push({
        pathname: "/(tabs)/accounts",
        params: {
          status: "success",
          message: "account added!",
        },
      });
    }
  }, [insertAccountsData]);

  const handleAddAccount = () => {
    console.log("aaaa", selectedAccountType, selectedBankName);
    if (
      selectedAccountType === "debit" &&
      selectedBankName !== null &&
      totalAmount >= 0
    ) {
      const payload = [
        {
          account_type: "debit",
          available_credit: null,
          bank_name: selectedBankName,
          credit_limit: null,
          total_amount: Number(totalAmount),
        },
      ];

      insertAccounts({ userId: 59, payload });
    } else if (selectedAccountType === "cash" && totalAmount >= 0) {
      const payload = [
        {
          account_type: "cash",
          available_credit: null,
          bank_name: null,
          credit_limit: null,
          total_amount: totalAmount,
        },
      ];
      insertAccounts({ userId: 59, payload });
    } else if (
      selectedAccountType === "debit" &&
      selectedBankName !== null &&
      creditLimit >= 0
    ) {
      const payload = [
        {
          account_type: "credit",
          available_credit: availableCredit,
          bank_name: selectedBankName,
          credit_limit: creditLimit,
          total_amount: null,
        },
      ];
      insertAccounts({ userId: 59, payload });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.leftContainer}>
            <Image
              source={require("../../assets/images/icons/back.png")}
              style={styles.goBackImage}
            />
          </Pressable>

          <Text style={styles.headerText}>Add Account</Text>

          <View style={styles.rightContainer}></View>
        </View>
        {insertAccountsIsLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: windowHeight,
            }}>
            <ActivityIndicator size="large" color={COLORS["primary-3"]} />
          </View>
        )}
        {!insertAccountsIsLoading && (
          <View style={styles.formContainer}>
            <RadioGroup
              values={accountTypes}
              selected={selectedAccountType}
              onSelected={setSelectedAccountType}
            />
            {(selectedAccountType === "debit" ||
              selectedAccountType === "credit") && (
              <Input
                label={"Enter bank name"}
                placeholder={"Enter bank name..."}
                numeric={false}
                onChangeText={setSelectedBankName}
              />
            )}
            {(selectedAccountType === "debit" ||
              selectedAccountType === "cash") && (
              <Input
                label={"Total amount"}
                placeholder={"Enter total amount..."}
                numeric={true}
                onChangeText={setTotalAmount}
              />
            )}
            {selectedAccountType === "credit" && (
              <Input
                label={"Available credit"}
                placeholder={"Enter available credit"}
                numeric={true}
                onChangeText={setAvailableCredit}
              />
            )}
            {selectedAccountType === "credit" && (
              <Input
                label={"Credit limit"}
                placeholder={"Enter credit limit"}
                numeric={true}
                onChangeText={setCreditLimit}
              />
            )}
            <Button
              text="Add account"
              buttonStyles={{ marginTop: 30 }}
              onPress={handleAddAccount}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
    textTransform: "capitalize",
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
    gap: 25,
    // height: windowHeight * 0.88,
  },
});

export default addAccount;
