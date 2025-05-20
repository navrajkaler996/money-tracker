import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import Input from "@/components/Input";
import TransactionsFlatList from "@/components/TransactionsFlatList";
import Button from "@/components/Button";

import { useInsertAccountsMutation } from "@/services/accountApi";

import { COLORS, ERRORS, STYLES } from "@/utils/constants";

import { useGetTransactionsByAccountIdQuery } from "@/services/transactionApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const editAccount = () => {
  const router = useRouter();
  const { account: accountInParams, userId } = useLocalSearchParams();

  const account = JSON.parse(accountInParams as string);

  //API for inserting accounts
  const [
    insertAccounts,
    {
      isLoading: insertAccountsIsLoading,
      error: insertAccountsError,
      data: insertAccountsData,
    },
  ] = useInsertAccountsMutation();

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    error: transactionError,
    refetch: transactionRefect,
  } = useGetTransactionsByAccountIdQuery({
    userId: userId,
    accountId: account?.account_id,
  });

  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useGetCategoriesByUserIdQuery(userId);

  const [transaction, setTransaction] = useState([]);
  //State to expand the transactions list. By default only recent 2 transactions will be visible.
  //while -1 means, entire list will be visible
  const [transactionListLimit, setTransactionListLimit] = useState(2);
  //State to show income form
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const [selectedAccountType, setSelectedAccountType] = useState("debit");
  const [selectedBankName, setSelectedBankName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [errors, setErrors] = useState({
    bankName: null,
    totalAmount: null,
    availableCredit: null,
    creditLimit: null,
  });

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

  useFocusEffect(
    useCallback(() => {
      if (transactionsData && categoriesData) {
        const result = createTransaction(transactionsData, categoriesData);

        if (result) setTransaction(result);
      }
    }, [transactionsData, categoriesData])
  );

  const handleAddAccount = () => {
    let isValid = true;
    const newErrors: any = {};

    // Validation for bankName and creditLimit
    if (
      (selectedAccountType === "credit" || selectedAccountType === "debit") &&
      selectedBankName?.length === 0
    ) {
      newErrors.bankName = ERRORS.NOT_EMPTY;
      isValid = false;
    }

    if (selectedAccountType === "credit" && creditLimit === 0) {
      newErrors.creditLimit = ERRORS.NOT_EMPTY;
      isValid = false;
    }

    // Validation for totalAmount (ensure it's non-negative)
    if (
      (selectedAccountType === "debit" || selectedAccountType === "cash") &&
      totalAmount < 0
    ) {
      newErrors.totalAmount = ERRORS.NOT_EMPTY;
      isValid = false;
    }

    // Set errors if any
    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    let payload: any = [];

    // Add debit account
    if (selectedAccountType === "debit") {
      if (selectedBankName?.length > 0 && totalAmount >= 0) {
        payload = [
          {
            account_type: "debit",
            available_credit: null,
            bank_name: selectedBankName,
            credit_limit: null,
            total_amount: Number(totalAmount),
          },
        ];
      }
    }

    // Add cash account
    else if (selectedAccountType === "cash" && totalAmount >= 0) {
      payload = [
        {
          account_type: "cash",
          available_credit: null,
          bank_name: null,
          credit_limit: null,
          total_amount: totalAmount,
        },
      ];
    }

    // Add credit account
    else if (selectedAccountType === "credit" && creditLimit >= 0) {
      payload = [
        {
          account_type: "credit",
          available_credit: Number(availableCredit),
          bank_name: selectedBankName,
          credit_limit: Number(creditLimit),
          total_amount: null,
        },
      ];
    }

    insertAccounts({ userId: userId, payload });
  };

  const createTransaction = (transactionData: any, categoriesData: any) => {
    let transaction = transactionsData?.map((transaction: any) => {
      const category = categoriesData.find(
        (cat: any) => cat.id === transaction.category_id
      );

      return {
        transactionAmount: transaction.transaction_amount,
        categoryName: category ? category.category_name : null,

        transactionDay: new Date(transaction.transaction_date).getDate(),
        transactionMonth: new Date(transaction.transaction_date).getMonth(),
        description: transaction.description,
      };
    });

    return transaction;
  };

  const handleArrow = () => {
    if (transactionListLimit === -1) setTransactionListLimit(2);
    else setTransactionListLimit(-1);
  };

  const handleAddIncome = () => {
    router.push({
      pathname: "/incomeOptions/addIncome",
      params: {
        account: JSON.stringify(account),
        userId,
      },
    });
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

          <Text style={styles.headerText}>{account?.bank_name}</Text>

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
            {(selectedAccountType === "debit" ||
              selectedAccountType === "cash") && (
              <Input
                label={"Account type"}
                numeric={true}
                value={account.account_type}
                error={undefined}
                editable={false}
              />
            )}
            {(selectedAccountType === "debit" ||
              selectedAccountType === "cash") && (
              <Input
                label={"Total amount"}
                numeric={true}
                onChangeText={setTotalAmount}
                value={account.total_amount}
                error={undefined}
              />
            )}
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
            <TouchableOpacity
              style={styles.incomeContainer}
              onPress={handleAddIncome}>
              <Image
                source={require("../../assets/images/icons/income.png")}
                style={styles.incomeImage}
              />
              <Text style={styles.incomeText}>
                Set up income for this account
              </Text>
            </TouchableOpacity>
            <Button
              text="Edit account"
              buttonStyles={{ marginTop: 10, marginBottom: 30 }}
              onPress={handleAddAccount}
            />
          </View>
        )}
        {transactionsData?.length > 0 && (
          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionHeading}>Recent Transactions</Text>
            <TransactionsFlatList
              data={transaction}
              limit={transactionListLimit}
            />
            <TouchableOpacity onPress={handleArrow}>
              {transactionListLimit !== -1 ? (
                <Image
                  source={require("../../assets/images/icons/arrow-down.png")}
                  style={styles.arrow}
                />
              ) : (
                <Image
                  source={require("../../assets/images/icons/arrow-up.png")}
                  style={styles.arrow}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
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
    width: windowWidth,
    marginTop: windowHeight * 0.15,
    alignItems: "center",
    // gap: 25,
    // height: windowHeight * 0.88,
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
});

export default editAccount;
