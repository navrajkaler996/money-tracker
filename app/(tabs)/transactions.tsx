import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
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

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function TransactionsScreen() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [userId, setUserId] = useState<Number>();

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    refetch: transactionRefect,
  } = useGetTransactionsByUserIdQuery({
    userId: userId,
    month: 1,
    year: 2025,
  });

  //State for dates to show transactions in calender
  const [markedDates, setMarkedDates] = useState({});

  //USEEFFECTS
  useEffect(() => {
    if (transactionsData) {
      const result = createMarkedDates(transactionsData);

      setMarkedDates(result);
    }
  }, [transactionsData]);

  useEffect(() => {
    if (user) setUserId(user?.userId);
  }, [user]);

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

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          minDate={"2012-05-10"}
          markingType={"custom"}
          dayComponent={({ date }) => {
            const customDay = markedDates[date.dateString];
            return (
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: customDay && COLORS["calender-color-1"],
                  borderColor: customDay && COLORS["primary-1"],
                  borderWidth: customDay && 1,
                  height: 40,
                  width: 40,
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
              </View>
            );
          }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.openContainer, STYLES.SHADOW_1]}
          onPress={handlePress}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
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
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}> Transactions by category</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/transaction-categories.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
        <View style={[styles.openContainer, STYLES.SHADOW_1]}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
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
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}> Add transaction</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/add-transaction.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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

    margin: 0,
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
});

export default TransactionsScreen;
