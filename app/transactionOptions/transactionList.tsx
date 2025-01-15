import { COLORS } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const transactions = [
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
  {
    day: 15,
    month: "Jan",
    category: "Walmart",
    amount: 200,
    type: "expense",
    account: "cibc-debit",
    accountNumber: "####-####-####-4098",
  },
];

const TransactionList = () => {
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

        <View style={styles.rightContainer}></View>
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

      <View style={styles.transactionListContainer}>
        <View style={styles.transactionGradientContainer}>
          <FlatList
            data={transactions}
            renderItem={(item) => (
              <LinearGradient
                colors={["#a8ff78", "#78ffd6"]}
                style={styles.transactionItem}>
                <View style={styles.day}>
                  <Text style={styles.textNumbers}>15</Text>{" "}
                  <Text style={{ ...styles.textHeading, fontSize: 16 }}>
                    Jan
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.categoryText}>Walmart</Text>
                  <Text style={styles.amountText}>-$200</Text>
                  <Text style={styles.accountNameText}>Cibc - debit</Text>
                  <Text style={styles.accountNumberText}>
                    {" "}
                    ####-####-####-4098
                  </Text>
                </View>
              </LinearGradient>
            )}
          />
          {/* <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.transactionItem}>
            <View style={styles.day}>
              <Text style={styles.textNumbers}>15</Text>{" "}
              <Text style={{ ...styles.textHeading, fontSize: 16 }}>Jan</Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.categoryText}>Walmart</Text>
              <Text style={styles.amountText}>-$200</Text>
              <Text style={styles.accountNameText}>Cibc - debit</Text>
              <Text style={styles.accountNumberText}> ####-####-####-4098</Text>
            </View>
          </LinearGradient> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  goBackImage: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 20,
  },
  transactionItem: {
    width: windowWidth * 0.95,
    minHeight: 100,
    flexDirection: "row",
    marginBottom: 30,
  },
  day: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#ddd",
    borderRightWidth: 1,
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
  },
  accountNameText: { fontFamily: "Aller_Rg", textTransform: "uppercase" },
  accountNumberText: { fontFamily: "Aller_Rg" },
});

export default TransactionList;
