import { COLORS } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

//Component to add a transaction
const addTransaction = () => {
  const [transaction, setTransaction] = useState({
    amount: 0,
  });
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

        <Text style={styles.headerText}>Add Transaction</Text>

        <View style={styles.rightContainer}></View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.textInput}
            value={`$${transaction.amount}`}
          />
        </View>

        <View style={styles.bottomContainer}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.gradient}>
            <View style={styles.tabsContainer}>
              <View style={{ ...styles.tab, ...styles.tab1 }}>
                <Text style={styles.tabText}>Account</Text>
              </View>

              <View style={styles.tab}>
                {" "}
                <Text style={styles.tabText}>Category</Text>
              </View>
              <View style={{ ...styles.tab, ...styles.tab3 }}>
                {" "}
                <Text style={styles.tabText}>Description</Text>
              </View>
            </View>
            <View style={styles.optionsContainer}>
              <Text>sdaasdsa</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
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
  },
  goBackImage: {
    width: 30,
    height: 30,
  },
  formContainer: {
    width: windowWidth,
    height: windowHeight * 0.85,
    marginTop: windowHeight * 0.15,

    alignItems: "center",
  },
  gradient: {
    width: windowWidth,
    height: "100%",
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  textInput: {
    fontSize: 90,
    height: 90,
  },
  amountContainer: {
    flex: 4,
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabsContainer: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: "#fff",
    width: windowWidth,
    flexDirection: "row",
  },
  optionsContainer: {
    flex: 8,
  },
  tab: {
    flex: 3.3,
    justifyContent: "center",
    alignItems: "center",
  },
  tab1: {
    borderRightColor: "#fff",
    borderRightWidth: 1.5,
  },
  tab3: {
    borderLeftColor: "#fff",
    borderLeftWidth: 1.5,
  },
  tabText: {
    fontFamily: "Aller_Bd",
    letterSpacing: 0.1,
    textTransform: "uppercase",
    fontSize: 12,
  },
});

export default addTransaction;
