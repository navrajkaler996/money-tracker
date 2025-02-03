import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";

import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";

import { COLORS, STYLES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import TransactionsFlatList from "@/components/TransactionsFlatList";
import { useGetExpensesByUserIdQuery } from "@/services/expenseApi";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function TransactionsScreen() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [userId, setUserId] = useState<Number>();
  const [selectedDate, setSelectedDate] = useState<String>();

  const [transactionQueryParams, setTransactionQueryParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date: undefined,
  });

  const [calenderData, setCalenderData] = useState();
  const [selectedDateData, setSelectedDateData] = useState();

  const [transaction, setTransaction] = useState([]);
  // const [transactionPayload, setTransactionPayload] = useState({
  //   month: 1,
  //   year: 2025,
  //   date: undefined,
  // });

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    refetch: transactionRefetch,
  } = useGetTransactionsByUserIdQuery({
    userId: userId,
    ...transactionQueryParams,
  });

  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useGetCategoriesByUserIdQuery(userId);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(userId);

  //State for dates to show transactions in calender
  const [markedDates, setMarkedDates] = useState({});

  //USEEFFECTS

  useEffect(() => {
    if (transactionsData && !calenderData) setCalenderData(transactionsData);
    else if (transactionsData) setSelectedDateData(transactionsData);
  }, [transactionsData]);

  useEffect(() => {
    if (calenderData) {
      const result = createMarkedDates(calenderData);

      setMarkedDates(result);
    }
  }, [calenderData]);

  useEffect(() => {
    if (selectedDate) {
      transactionRefetch();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (user) setUserId(user?.userId);
  }, [user]);

  useEffect(() => {
    if (selectedDateData && categoriesData && accountsData) {
      const result = createTransaction(
        selectedDateData,
        categoriesData,
        accountsData
      );

      if (result) setTransaction(result);
    }
  }, [selectedDateData, categoriesData, accountsData]);

  //FUNCTIONS

  //Navigate to different screen
  const handlePress = (value: string) => {
    if (value === "add-transaction") {
      // navigation.navigate("transactionOptions/addTransaction");
      router.push({
        pathname: "/transactionOptions/addTransaction",
        params: {
          userId: userId,
        },
      });
    } else if (value === "transactions-by-category") {
      router.push({
        pathname: "/transactionOptions/transactionsByCategory",
        params: {
          userId: userId,
        },
      });
    } else {
      router.push({
        pathname: "/transactionOptions/recentTransactions",
        params: {
          userId: userId,
        },
      });
    }
  };

  //Creating dates with transaction for calender
  const createMarkedDates = (transactions: any) => {
    const groupedData: any = {};

    transactions.forEach((transaction: any) => {
      const transactionDate = new Date(transaction.transaction_date);
      const formattedDate = transactionDate.toISOString().split("T")[0];

      // Initialize the date entry if it doesn't exist
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = { customText: 0 };
      }

      // Add the transaction amount to the existing sum for that date
      groupedData[formattedDate].customText += transaction.transaction_amount;
    });

    return groupedData;
  };

  const handleSelectedDate = (date: string) => {
    setSelectedDate(date);
    setTransactionQueryParams({
      month: undefined,
      year: undefined,
      date: date,
    });
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          minDate={"2012-05-10"}
          markingType={"custom"}
          dayComponent={({ date }) => {
            const customDay = markedDates[date.dateString];

            return (
              <Pressable
                style={{
                  alignItems: "center",
                  backgroundColor: customDay && COLORS["calender-color-1"],
                  borderColor: customDay && COLORS["primary-1"],
                  borderWidth: customDay && 1,
                  height: 40,
                  width: 40,
                }}
                onPress={() => {
                  customDay && handleSelectedDate(date?.dateString);
                }}>
                <Text style={{ position: "absolute", top: 2 }}>{date.day}</Text>
                {/* {customDay && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "red",
                      fontWeight: "bold",
                      position: "absolute",
                      bottom: 16,
                    }}>
                    -{customDay.customText}
                  </Text>
                )} */}
                {customDay && (
                  <Text
                    style={{
                      fontSize: 8,
                      color: "red",
                      fontWeight: "bold",
                      position: "absolute",
                      bottom: 2,
                    }}>
                    -{customDay.customText}
                  </Text>
                )}
              </Pressable>
            );
          }}
        />
      </View>
      {selectedDate && transaction?.length > 0 && (
        <ScrollView contentContainerStyle={styles.transactionListContainer}>
          <View style={styles.transactionGradientContainer}>
            {/* <Text style={styles.transactionHeading}>
              Transactions on {selectedDate}
            </Text> */}
            <View style={styles.closeButtonContainer}>
              <Text style={styles.transactionHeading}>
                {transaction?.length}
              </Text>
              <Text style={styles.transactionHeading}>Transaction(s)</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setSelectedDate(undefined);
                  // setTransaction([]);
                }}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable>
            </View>
            <TransactionsFlatList data={transaction} />
          </View>
        </ScrollView>
      )}
      {!selectedDate && (
        <ScrollView contentContainerStyle={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.openContainer, STYLES.SHADOW_1]}
            onPress={handlePress}>
            <LinearGradient
              colors={["#a8ff78", "#78ffd6"]}
              style={styles.option}>
              <Text style={styles.optionHeading}>Recent Transactions</Text>
              <Image
                style={styles.optionImage}
                source={require("../../assets/images/icons/transaction-2.png")}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.openContainer, STYLES.SHADOW_1]}
            onPress={() => handlePress("transactions-by-category")}>
            <LinearGradient
              colors={["#a8ff78", "#78ffd6"]}
              style={styles.option}>
              <Text style={styles.optionHeading}>
                {" "}
                Transactions by category
              </Text>
              <Image
                style={styles.optionImage}
                source={require("../../assets/images/icons/transaction-categories.png")}
              />
            </LinearGradient>
          </TouchableOpacity>
          <View style={[styles.openContainer, STYLES.SHADOW_1]}>
            <LinearGradient
              colors={["#a8ff78", "#78ffd6"]}
              style={styles.option}>
              <Text style={styles.optionHeading}> Upcoming transactions</Text>
              <Image
                style={styles.optionImage}
                source={require("../../assets/images/icons/transaction-2.png")}
              />
            </LinearGradient>
          </View>
          <TouchableOpacity
            style={[styles.openContainer, STYLES.SHADOW_1]}
            onPress={() => handlePress("add-transaction")}>
            <LinearGradient
              colors={["#a8ff78", "#78ffd6"]}
              style={styles.option}>
              <Text style={styles.optionHeading}> Add transaction</Text>
              <Image
                style={styles.optionImage}
                source={require("../../assets/images/icons/add-transaction.png")}
              />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    width: windowWidth,

    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  openContainer: {},
  option: {
    width: windowWidth * 0.35,
    height: windowHeight * 0.15,
    marginBottom: 30,

    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,

    alignItems: "center",
    justifyContent: "space-between",
  },
  optionHeading: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    textAlign: "center",
  },
  optionImage: {
    width: 45,
    height: 45,
  },
  transactionListContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 100,
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
  transactionHeading: {
    textAlign: "center",
    fontFamily: "Aller_Rg",
    fontSize: 20,
  },
  closeButtonContainer: {
    width: windowWidth * 0.9,

    alignItems: "center",
  },
  closeButton: {
    paddingLeft: 10,
    paddingRight: 10,
    position: "absolute",
    right: 0,
  },
  closeButtonText: {
    fontSize: 20,
  },
});

export default TransactionsScreen;
