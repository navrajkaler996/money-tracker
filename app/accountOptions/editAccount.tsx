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

import { PieChart } from "react-native-chart-kit";

import Input from "@/components/Input";
import TransactionsFlatList from "@/components/TransactionsFlatList";
import Button from "@/components/Button";

import { useEditAccountMutation } from "@/services/accountApi";

import { CHART_COLORS, COLORS, ERRORS } from "@/utils/constants";

import { useGetTransactionsByAccountIdQuery } from "@/services/transactionApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";

import { chartConfig } from "@/utils/helpers";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const editAccount = () => {
  const router = useRouter();
  const { account: accountInParams, userId } = useLocalSearchParams();

  const account = JSON.parse(accountInParams as string);

  //API for inserting accounts
  const [
    editAccount,
    {
      isLoading: editAccountsIsLoading,
      error: editAccountsError,
      data: editAccountsData,
    },
  ] = useEditAccountMutation();

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    error: transactionError,
    refetch: transactionRefetch,
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
    if (!editAccountsIsLoading && editAccountsData) {
      router.push({
        pathname: "/(tabs)/accounts",
        params: {
          status: "success",
          message: "account updated!",
        },
      });
    }
  }, [editAccountsData]);

  //This useFocusEffect refetchs the transactionData
  useFocusEffect(
    useCallback(() => {
      transactionRefetch();
      createDataForBarChart(transactionsData);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (transactionsData && categoriesData) {
        const result = createTransaction(transactionsData, categoriesData);

        if (result) setTransaction(result);

        createDataForPieChart(transactionsData, categoriesData);
      }
    }, [transactionsData, categoriesData])
  );

  useFocusEffect(
    useCallback(() => {
      if (totalAmount !== account?.total_amount) {
        setTotalAmount(Number(account.total_amount));
      }
    }, [])
  );

  const handleUpdateAccount = () => {
    let isValid = true;
    const newErrors: any = {};

    // // Validation for bankName and creditLimit
    // if (
    //   (selectedAccountType === "credit" || selectedAccountType === "debit") &&
    //   selectedBankName?.length === 0
    // ) {
    //   newErrors.bankName = ERRORS.NOT_EMPTY;
    //   isValid = false;
    // }

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

    // Update debit account
    if (selectedAccountType === "debit") {
      if (totalAmount >= 0) {
        payload = {
          total_amount: Number(totalAmount),
        };
      }
    }

    // // Add cash account
    // else if (selectedAccountType === "cash" && totalAmount >= 0) {
    //   payload = [
    //     {
    //       account_type: "cash",
    //       available_credit: null,
    //       bank_name: null,
    //       credit_limit: null,
    //       total_amount: totalAmount,
    //     },
    //   ];
    // }

    // // Add credit account
    // else if (selectedAccountType === "credit" && creditLimit >= 0) {
    //   payload = [
    //     {
    //       account_type: "credit",
    //       available_credit: Number(availableCredit),
    //       bank_name: selectedBankName,
    //       credit_limit: Number(creditLimit),
    //       total_amount: null,
    //     },
    //   ];
    // }

    editAccount({ account_id: account?.account_id, payload });
  };

  //Function to create a list of transactions
  const createTransaction = (transactionsData: any, categoriesData: any) => {
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

  //Function to create the data for pie chart
  const createDataForPieChart = (
    transactionsData: any,
    categoriesData: any
  ) => {
    let counter = -1;
    let data = categoriesData?.map((category: any) => {
      counter++;
      return {
        name: category.category_name,
        category_id: category.id,
        transaction_amount: 0,
        color: CHART_COLORS[counter],
        legendFontColor: "#7F7F7F",
      };
    });

    transactionsData?.forEach((transaction: any) => {
      data?.forEach((category: any) => {
        if (category.category_id === transaction.category_id) {
          category.transaction_amount += transaction.transaction_amount;
        }
      });
    });

    return data;
  };

  //Function to create the data for bar chart
  const createDataForBarChart = (transactionData: any) => {
    const month = new Date().getMonth();

    let data = {
      labels: [],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0],
        },
      ],
    };

    for (let i = 5; i >= 0; i--) {
      const index = (month - i + 12) % 12;
      data.labels.push(index);
    }

    let labels = data.labels;
    let datasets = [0, 0, 0, 0, 0, 0];
    transactionData?.forEach((transaction: any) => {
      const dateString = transaction.transaction_date;
      const date = new Date(dateString);

      const monthIndex = date.getMonth(); //4

      let indexInLabel = labels.indexOf(monthIndex);

      datasets[indexInLabel] += transaction.transaction_amount;
    });

    data.datasets[0].data = datasets;

    return data;
  };

  //Function triggers when arrow is clicked to expand or limit the transaction list
  const handleArrow = () => {
    if (transactionListLimit === -1) setTransactionListLimit(2);
    else setTransactionListLimit(-1);
  };

  //Function to add income
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
        {editAccountsIsLoading && (
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
        {!editAccountsIsLoading && (
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
                value={totalAmount}
                error={undefined}
              />
            )}

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
              onPress={handleUpdateAccount}
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
        {transactionIsLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: windowHeight,
            }}>
            <ActivityIndicator size="large" color={COLORS["primary-3"]} />
          </View>
        ) : (
          !transactionIsLoading &&
          transactionsData?.length > 0 &&
          categoriesData?.length > 0 && (
            <View style={styles.chartContainer}>
              <PieChart
                data={createDataForPieChart(transactionsData, categoriesData)}
                width={windowWidth * 0.8}
                height={220}
                chartConfig={chartConfig}
                accessor={"transaction_amount"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
              />

              {/* <Image
              source={require("../../assets/images/icons/two-sided.png")}
              style={styles.twoSidedArrow}
            /> */}
            </View>
          )
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
  chartContainer: {
    flex: 1,
    marginBottom: 100,
  },
  twoSidedArrow: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});

export default editAccount;
