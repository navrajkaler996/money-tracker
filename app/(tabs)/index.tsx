import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGetExpensesByUserIdQuery } from "@/services/expenseApi";
import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }: any) {
  const [totalExpenses, setTotalExpenses] = useState(0);

  const {
    data: expensesData,
    error: expensesError,
    isLoading: expensesIsLoading,
  } = useGetExpensesByUserIdQuery(1);

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: transactionsIsLoading,
  } = useGetTransactionsByUserIdQuery({ userId: 1, month: 12, year: 2024 });

  useEffect(() => {
    if (transactionsData?.length > 0) {
      const total = transactionsData?.reduce(
        (accumulator: Number, transaction: any) => {
          return accumulator + transaction.transaction_amount;
        },
        0
      );

      setTotalExpenses(total);
    }
  }, [transactionsData]);

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.expenseContainer}>
            <View style={[styles.viewInGradient]}>
              <Text style={[styles.textHeading, { fontSize: 14 }]}>
                Expense
              </Text>
              <Text style={[styles.textNumbers, { fontSize: 24 }]}>
                ${totalExpenses}
              </Text>
            </View>
          </View>
          <View style={styles.accountContainter}>
            <View style={[styles.viewInGradient]}>
              <Text style={[styles.textHeading]}>Cash</Text>
              <Text style={[styles.textNumbers]}>$1500</Text>
            </View>
            <View style={[styles.viewInGradient]}>
              <Text style={[styles.textHeading]}>Debit</Text>
              <Text style={[styles.textNumbers]}>$23500</Text>
            </View>
            <View style={[styles.viewInGradient]}>
              <Text style={[styles.textHeading]}>Credit</Text>
              <Text style={[styles.textNumbers]}>$500</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.cardGradient}>
            <Text style={[styles.cardHeading]}>Grocery</Text>
            <Image
              source={require("../../assets/images/icons/grocery.png")}
              style={styles.icon}
            />
            <Text style={[styles.cardNumbers]}>$532.36</Text>
          </LinearGradient>
        </View>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.cardGradient}>
            <Text style={[styles.cardHeading]}>Transport</Text>
            <Image
              source={require("../../assets/images/icons/transport.png")}
              style={styles.icon}
            />
            <Text style={[styles.cardNumbers]}>$123.06</Text>
          </LinearGradient>
        </View>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.cardGradient}>
            <Text style={[styles.cardHeading]}>Food</Text>
            <Image
              source={require("../../assets/images/icons/food.png")}
              style={styles.icon}
            />
            <Text style={[styles.cardNumbers]}>$200</Text>
          </LinearGradient>
        </View>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.cardGradient}>
            <Text style={[styles.cardHeading]}>Gym</Text>
            <Image
              source={require("../../assets/images/icons/gym.png")}
              style={styles.icon}
            />
            <Text style={[styles.cardNumbers]}>$70</Text>
          </LinearGradient>
        </View>
      </View>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

  mainContainer: {
    marginTop: 40,
    width: windowWidth * 0.95,
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to multiple rows
    justifyContent: "space-between", // Space items evenly
    // paddingHorizontal: 10, // Add some padding on the sides
  },
  cardGradient: {
    width: windowWidth * 0.25, // Adjust card width
    height: 130,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },

  cardShadow: {
    // Shadow styles for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,

    marginBottom: 15,
    borderRadius: 10,
  },
  cardHeading: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
  },
  cardNumbers: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
  },
  icon: {
    width: 40,
    height: 40,
    marginVertical: 5,
  },
});

export default HomeScreen;
