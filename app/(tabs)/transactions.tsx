import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function TransactionsScreen() {
  const navigation = useNavigation();
  const handlePress = (value: string) => {
    if (value === "add-transaction") {
      navigation.navigate("transactionOptions/addTransaction");
    } else navigation.navigate("transactionOptions/recentTransactions");
  };
  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          minDate={"2012-05-10"}
          markingType={"custom"}
          markedDates={{
            "2025-01-28": {
              customStyles: {
                container: {
                  backgroundColor: "green",
                },
                text: {
                  color: "black",
                  fontWeight: "bold",
                },
              },
            },
          }}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.openContainer} onPress={handlePress}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}>Recent Transactions</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/transaction-2.png")}
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.openContainer}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}> Transactions by category</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/transaction-categories.png")}
            />
          </LinearGradient>
        </View>
        <View style={styles.openContainer}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}> Upcoming transactions</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/transaction-2.png")}
            />
          </LinearGradient>
        </View>
        <TouchableOpacity
          style={styles.openContainer}
          onPress={() => handlePress("add-transaction")}>
          <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.option}>
            <Text style={styles.optionHeading}> Add transaction</Text>
            <Image
              style={styles.optionImage}
              source={require("../../assets/images/icons/add-transaction.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    marginBottom: 40,
  },
  bottomContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  openContainer: {
    // Shadow styles for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
  },
  option: {
    width: 150,
    height: 150,
    marginBottom: 30,

    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,

    alignItems: "center",
    justifyContent: "space-around",
  },
  optionHeading: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    textAlign: "center",
  },
  optionImage: {
    width: 50,
    height: 50,
  },
});

export default TransactionsScreen;
