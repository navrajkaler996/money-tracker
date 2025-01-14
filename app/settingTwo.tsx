// SettingTwo.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { COLORS } from "@/utils/constants";

const windowWidth = Dimensions.get("window").width;

interface SettingTwoProps {
  activeAccount: string;
  setActiveAccount: React.Dispatch<React.SetStateAction<any>>;
  accounts: Array<any>;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>; // setter for accounts
  handleAccounts: (activeAccount: string) => void;
}

const SettingTwo = ({
  activeAccount,
  setActiveAccount,
  accounts,
  setAccounts,
  handleAccounts,
}: SettingTwoProps) => {
  const [cashAmount, setCashAmount] = useState<string>("");
  const [debitBankName, setDebitBankName] = useState<string>("");
  const [debitAmount, setDebitAmount] = useState<string>("");
  const [creditBankName, setCreditBankName] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");

  const handleAddAccount = () => {
    if (activeAccount === "cash") {
      if (cashAmount.trim() === "") {
        alert("Please enter the total cash amount.");
        return;
      }

      setAccounts([
        ...accounts,
        {
          type: "cash",
          amount: parseFloat(cashAmount),
        },
      ]);
      setCashAmount("");
      setActiveAccount("accounts");
    } else if (activeAccount === "debit") {
      if (debitBankName.trim() === "" || debitAmount.trim() === "") {
        alert("Please enter bank name and total amount.");
        return;
      }

      setAccounts([
        ...accounts,
        {
          type: "debit",
          bankName: debitBankName,
          amount: parseFloat(debitAmount),
        },
      ]);
      setDebitBankName("");
      setDebitAmount("");
      setActiveAccount("accounts");
    } else if (activeAccount === "credit") {
      if (
        creditBankName.trim() === "" ||
        creditLimit.trim() === "" ||
        creditAmount.trim() === ""
      ) {
        alert("Please enter all credit card details.");
        return;
      }

      setAccounts([
        ...accounts,
        {
          type: "credit",
          bankName: creditBankName,
          limit: parseFloat(creditLimit),
          credit: parseFloat(creditAmount),
        },
      ]);
      setCreditBankName("");
      setCreditLimit("");
      setCreditAmount("");
      setActiveAccount("accounts");
    }
  };

  return (
    <View>
      <View style={styles.categoryCapsuleContainer}>
        <Pressable
          style={
            activeAccount === "cash"
              ? styles.categoryCapsuleActive
              : styles.categoryCapsule
          }
          onPress={() => handleAccounts("cash")}>
          <Text style={styles.categoryCapsuleText}>Cash</Text>
        </Pressable>
        <Pressable
          style={
            activeAccount === "debit"
              ? styles.categoryCapsuleActive
              : styles.categoryCapsule
          }
          onPress={() => handleAccounts("debit")}>
          <Text style={styles.categoryCapsuleText}>Debit</Text>
        </Pressable>
        <Pressable
          style={
            activeAccount === "credit"
              ? styles.categoryCapsuleActive
              : styles.categoryCapsule
          }
          onPress={() => handleAccounts("credit")}>
          <Text style={styles.categoryCapsuleText}>Credit</Text>
        </Pressable>
      </View>
      {activeAccount === "accounts" && (
        <View style={styles.accountsContainer}>
          {accounts?.map((account) => {
            return (
              <Pressable style={styles.categoryCapsuleActive}>
                <Text style={styles.categoryCapsuleText}>
                  {account?.bankName}-{account?.type}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Cash Account Form */}
      {activeAccount === "cash" && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={cashAmount}
            onChangeText={setCashAmount}
            placeholder="Enter total cash you have"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <Pressable style={styles.buttonCash} onPress={handleAddAccount}>
            <Text style={styles.buttonTextCash}>Create account</Text>
          </Pressable>
        </View>
      )}

      {/* Debit Account Form */}
      {activeAccount === "debit" && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={debitBankName}
            onChangeText={setDebitBankName}
            placeholder="Enter bank name"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            value={debitAmount}
            onChangeText={setDebitAmount}
            placeholder="Enter total amount"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <Pressable style={styles.buttonCash} onPress={handleAddAccount}>
            <Text style={styles.buttonTextCash}>Create account</Text>
          </Pressable>
        </View>
      )}

      {/* Credit Account Form */}
      {activeAccount === "credit" && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={creditBankName}
            onChangeText={setCreditBankName}
            placeholder="Enter bank name"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            value={creditLimit}
            onChangeText={setCreditLimit}
            placeholder="Enter total limit"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={creditAmount}
            onChangeText={setCreditAmount}
            placeholder="Enter credit"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <Pressable style={styles.buttonCash} onPress={handleAddAccount}>
            <Text style={styles.buttonTextCash}>Create account</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryCapsuleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  categoryCapsule: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["primary-3"],
    borderRadius: 20,
    justifyContent: "center",
  },
  categoryCapsuleActive: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["active-yellow"],
    borderRadius: 20,
    justifyContent: "center",
  },
  categoryCapsuleText: {
    color: "#000",
    fontFamily: "Aller_Rg",
  },
  input: {
    width: windowWidth * 0.7,
    height: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#ccc",
    fontSize: 16,
    backgroundColor: "transparent",
    paddingLeft: 10,
  },
  form: {
    marginTop: 20,
    alignItems: "center",
    gap: 15,
  },
  buttonCash: {
    width: windowWidth * 0.3,
    height: 30,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextCash: {
    fontSize: 12,
    textTransform: "capitalize",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
  accountsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default SettingTwo;
