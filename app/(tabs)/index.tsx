import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";
import CategoryContainer from "@/components/CategoryContainer";

import { COLORS } from "@/utils/constants";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface CalculatedAccounts {
  totalDebitAmount: number;
  totalCashAmount: number;
  totalCredit: number;
}

function HomeScreen() {
  const router = useRouter();

  const { message, status } = useLocalSearchParams();

  const { user, token } = useAuth();

  const [userId, setUserId] = useState<Number>();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [calculatedAccounts, setCalculatedAccounts] =
    useState<CalculatedAccounts>({
      totalDebitAmount: 0,
      totalCashAmount: 0,
      totalCredit: 0,
    });
  const [transactionQueryParams, setTransactionQueryParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date: undefined,
  });

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    refetch: transactionRefect,
  } = useGetTransactionsByUserIdQuery({
    userId: userId,
    ...transactionQueryParams,
  });
  const { data: categoriesData, isLoading: categoriesIsLoading } =
    useGetCategoriesByUserIdQuery(userId);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
    refetch: accountRefetch,
  } = useGetAccountsQuery(userId);

  //Using useFocusEffect hook to call transactionRefect()
  /////This will update the transaction data
  useFocusEffect(() => {
    transactionRefect();
    accountRefetch();
  });

  //Creating expenses for user
  useEffect(() => {
    if (transactionsData?.length > 0) {
      const total = transactionsData.reduce(
        (accumulator: Number, transaction: any) => {
          return accumulator + transaction.transaction_amount;
        },
        0
      );
      setTotalExpenses(total);
    }
  }, [transactionsData]);

  //Createing ledger
  /////i.e. user transactions according to categories
  useEffect(() => {
    if (categoriesData?.length > 0 && transactionsData?.length > 0) {
      calculateTransactionsByCategory(categoriesData, transactionsData);
    }
  }, [categoriesData, transactionsData]);

  //Calculating data in user accounts
  useEffect(() => {
    if (accountsData?.length > 0) {
      let totalDebitAmount = 0;
      let totalCashAmount = 0;
      let totalCredit = 0;

      // Calculate total debit amount if there are debit accounts
      if (
        accountsData.some((account: any) => account.account_type === "debit")
      ) {
        totalDebitAmount = accountsData
          .filter((account: any) => account.account_type === "debit")
          .reduce(
            (total: number, account: any) => total + account.total_amount,
            0
          );
      }

      // Calculate total cash amount if there are cash accounts
      if (
        accountsData.some((account: any) => account.account_type === "cash")
      ) {
        totalCashAmount = accountsData
          .filter((account: any) => account.account_type === "cash")
          .reduce(
            (total: number, account: any) => total + account.total_amount,
            0
          );
      }

      // Calculate total available credit if there are credit accounts
      if (
        accountsData.some((account: any) => account.account_type === "credit")
      ) {
        totalCredit = accountsData
          .filter((account: any) => account.account_type === "credit")
          .reduce(
            (total: number, account: any) =>
              total + (account.credit_limit - account.available_credit),
            0
          );
      }

      setCalculatedAccounts({
        totalCashAmount,
        totalDebitAmount,
        totalCredit,
      });
    }
  }, [accountsData]);

  //Showing toast notification when transaction is added
  useEffect(() => {
    if (status === "success") {
      Toast.show({
        type: "success",
        text1: message.toString(),
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 100,
      });
    } else if (status === "failed") {
      Toast.show({
        type: "success",
        text1: message.toString(),
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 100,
      });
    }
  }, [message, status]);

  useEffect(() => {
    if (user) setUserId(user?.userId);
  }, [user]);

  const calculateTransactionsByCategory = (
    categoriesData: any,
    transactionsData: any
  ) => {
    let transactionsByCategory = categoriesData.map((c: any) => ({
      ...c,
      total_amount: 0,
    }));

    transactionsData.forEach((transaction: any) => {
      transactionsByCategory.forEach((category: any) => {
        if (transaction.category_id === category.id) {
          category.total_amount += transaction.transaction_amount;
        }
      });
    });

    setLedger(transactionsByCategory);
  };

  const handleCategory = (categoryId: any) => {
    router.push({
      pathname: "/transactionOptions/transactionsByCategory",
      params: {
        categoryId,
        userId,
      },
    });
  };

  if (transactionIsLoading && categoriesIsLoading && accountsIsLoading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: windowHeight,
        }}>
        <ActivityIndicator size="large" color={COLORS["primary-3"]} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.expenseContainer}>
            <View style={styles.viewInGradient}>
              <Text style={[styles.textHeading, { fontSize: 14 }]}>
                Expense
              </Text>
              <Text
                style={[
                  styles.textNumbers,
                  { fontSize: 24 },
                ]}>{`$${totalExpenses}`}</Text>
            </View>
          </View>
          <View style={styles.accountContainter}>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Cash</Text>
              <Text style={styles.textNumbers}>
                ${calculatedAccounts?.totalCashAmount}
              </Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Debit</Text>
              <Text style={styles.textNumbers}>
                ${calculatedAccounts?.totalDebitAmount}
              </Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Credit</Text>
              <Text style={styles.textNumbers}>
                ${calculatedAccounts.totalCredit}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {ledger.length > 0 && (
        <CategoryContainer ledger={ledger} handleCategory={handleCategory} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  gradientContainer: {
    width: windowWidth,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
    borderRadius: 10,
  },
  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  expenseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  accountContainter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    marginTop: 25,
  },
  viewInGradient: {
    width: windowWidth * 0.25,
    height: windowHeight * 0.15,
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
});

export default HomeScreen;
