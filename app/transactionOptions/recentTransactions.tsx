import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";
import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";

import { COLORS, MONTHS } from "@/utils/constants";
import { useNavigation } from "expo-router";
import TransactionsFlatList from "@/components/TransactionsFlatList";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const RecentTransactions = () => {
  const navigation = useNavigation();

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    refetch: transactionRefect,
  } = useGetTransactionsByUserIdQuery({
    userId: 59,
    month: 1,
    year: 2025,
  });

  const { data: categoriesData, isLoading: categoriesIsLoading } =
    useGetCategoriesByUserIdQuery(59);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(59);

  const [transaction, setTransaction] = useState([]);

  const createTransaction = (
    transactionsData: any,
    categoriesData: any,
    accountsData: any
  ) => {
    let transaction = transactionsData?.map((transaction: any) => {
      const category = categoriesData.find(
        (cat: any) => cat.id === transaction.category_id
      );

      const account = accountsData.find(
        (account: any) => account.account_id === transaction.account_id
      );

      return {
        transactionAmount: transaction.transaction_amount,
        categoryName: category ? category.category_name : null,
        accountType: account ? account.account_type : null,
        bankName: account ? account.bank_name : null,
        transactionDay: new Date(transaction.transaction_date).getDate(),
        transactionMonth: new Date(transaction.transaction_date).getMonth(),
        description: transaction.description,
      };
    });

    return transaction;
  };

  const getMonth = (month: string) => MONTHS[Number(month)];

  useEffect(() => {
    if (transactionsData && categoriesData && accountsData) {
      const result = createTransaction(
        transactionsData,
        categoriesData,
        accountsData
      );

      if (result) setTransaction(result);
    }
  }, [transactionsData, categoriesData, accountsData]);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Pressable style={styles.leftContainer}>
          <Image
            source={require("../../assets/images/icons/back.png")}
            style={styles.goBackImage}
          />
        </Pressable>

        <Text style={styles.headerText}>Recent Transactions</Text>

        <Pressable
          style={styles.rightContainer}
          onPress={() => {
            navigation.navigate("transactionOptions/addTransaction");
          }}>
          <Image
            style={[styles.addTransactionImage]}
            source={require("../../assets/images/icons/add-transaction.png")}
            // style={styles.goBackImage}
          />
        </Pressable>
      </View>

      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.accountContainter}>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Income</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Net worth</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Expenses</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {!transactionIsLoading && transaction?.length > 0 && (
        <ScrollView contentContainerStyle={styles.transactionListContainer}>
          <View style={styles.transactionGradientContainer}>
            <TransactionsFlatList data={transaction} />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textTransform: "capitalize",
    fontSize: 18,
    color: "#000",
    flex: 2,
    textAlign: "center",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  goBackImage: {
    width: 30,
    height: 30,
  },
  addTransactionImage: {
    width: 30,
    height: 30,
  },

  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  gradientContainer: {
    width: windowWidth,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
    borderRadius: 10,
    marginTop: windowHeight * 0.12,
    zIndex: 1,
  },
  viewInGradient: {
    width: windowWidth * 0.25,
    // height: windowHeight * 0.15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  textHeading: {
    fontFamily: "Aller_Rg",
    textTransform: "uppercase",
    letterSpacing: 0.1,
    fontSize: 12,
  },
  textNumbers: {
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.1,
    fontSize: 20,
    marginTop: 5,
  },
  accountContainter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  transactionListContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  transactionGradientContainer: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    gap: 20,
  },
  transactionItem: {
    width: windowWidth * 0.9,
    minHeight: 70,
    flexDirection: "row",
    marginBottom: 30,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  day: {
    flex: 1.5,
    // justifyContent: "center",
    alignItems: "center",
    // borderRightColor: "#ddd",
    // borderRightWidth: 1,
  },
  transactionInfo: {
    flex: 7,
    gap: 5,
    paddingLeft: 10,
    justifyContent: "center",
  },
  categoryText: {
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.1,
  },
  amountText: {
    fontFamily: "Aller_Bd",
    color: "red",
    position: "absolute",
    top: 5,
    right: 10,
  },
  accountNameText: { fontFamily: "Aller_Rg", textTransform: "uppercase" },
  accountNumberText: { fontFamily: "Aller_Rg" },
});

export default RecentTransactions;
