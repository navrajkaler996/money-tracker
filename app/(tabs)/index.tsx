import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import CategoryContainer from "@/components/CategoryContainer";

import { COLORS } from "@/utils/constants";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }: any) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [ledger, setLedger] = useState([]);

  const { data: transactionsData, isLoading: transactionIsLoading } =
    useGetTransactionsByUserIdQuery({
      userId: 1,
      month: 12,
      year: 2024,
    });
  const { data: categoriesData, isLoading: categoriesIsLoading } =
    useGetCategoriesQuery(null);

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
        if (transaction.categoryId === category.id) {
          category.total_amount += transaction.transaction_amount;
        }
      });
    });

    setLedger(transactionsByCategory);
  };

  if (transactionIsLoading && categoriesIsLoading)
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
              <Text style={styles.textNumbers}>$1500</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Debit</Text>
              <Text style={styles.textNumbers}>$23500</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Credit</Text>
              <Text style={styles.textNumbers}>$500</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {ledger.length > 0 && <CategoryContainer ledger={ledger} />}
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
