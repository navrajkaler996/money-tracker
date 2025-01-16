import { COLORS } from "@/utils/constants";
import { Picker } from "@react-native-picker/picker";
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
import { Dropdown } from "react-native-element-dropdown";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const accountTypeData = [
  { label: "Debit", value: "debit" },
  { label: "Credit", value: "credit" },
  { label: "Cash", value: "cash" },
];
const accountsData = [
  { label: "CIBC", value: "debit" },
  { label: "Credit", value: "credit" },
  { label: "Cash", value: "cash" },
];

//Component to add a transaction
const addTransaction = () => {
  const [transaction, setTransaction] = useState({
    amount: 0,
  });

  const [activeTab, setActiveTab] = useState("account");

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handlePress = (value: string) => {
    setActiveTab(value);
  };

  const renderLabel = () => {
    return <Text style={[styles.label]}>Select an account</Text>;
  };
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
              <Pressable
                style={
                  activeTab === "category"
                    ? { ...styles.activeTab, ...styles.tab, ...styles.tab1 }
                    : { ...styles.tab, ...styles.tab1 }
                }
                onPress={() => handlePress("category")}>
                <Text
                  style={
                    activeTab === "category"
                      ? [styles.tabText, styles.activeTabText]
                      : [styles.tabText]
                  }>
                  Category
                </Text>
              </Pressable>
              <Pressable
                style={
                  activeTab === "account"
                    ? { ...styles.activeTab, ...styles.tab, ...styles.tab1 }
                    : { ...styles.tab, ...styles.tab1 }
                }
                onPress={() => handlePress("account")}>
                <Text
                  style={
                    activeTab === "account"
                      ? [styles.tabText, styles.activeTabText]
                      : [styles.tabText]
                  }>
                  Account
                </Text>
              </Pressable>
              <Pressable
                style={
                  activeTab === "description"
                    ? { ...styles.activeTab, ...styles.tab, ...styles.tab1 }
                    : { ...styles.tab, ...styles.tab1 }
                }
                onPress={() => handlePress("description")}>
                <Text
                  style={
                    activeTab === "description"
                      ? [styles.tabText, styles.activeTabText]
                      : [styles.tabText]
                  }>
                  Description
                </Text>
              </Pressable>
            </View>
            <View style={styles.optionsContainer}>
              {activeTab === "account" && (
                <>
                  {" "}
                  <View>
                    {renderLabel()}
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={accountTypeData}
                      onChange={function (item: any): void {}}
                      maxHeight={300}
                      labelField={"label"}
                      valueField={"value"}
                      onFocus={() => setIsFocus(true)}></Dropdown>
                  </View>
                  <View>
                    {renderLabel()}
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={accountsData}
                      onChange={function (item: any): void {}}
                      maxHeight={300}
                      labelField={"label"}
                      valueField={"value"}
                      onFocus={() => setIsFocus(true)}></Dropdown>
                  </View>
                </>
              )}
              {activeTab === "category" && (
                <>
                  {" "}
                  <View>
                    {renderLabel()}
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={accountTypeData}
                      onChange={function (item: any): void {}}
                      maxHeight={300}
                      labelField={"label"}
                      valueField={"value"}
                      onFocus={() => setIsFocus(true)}></Dropdown>
                  </View>
                  <Pressable style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>Add category</Text>
                  </Pressable>
                </>
              )}
              {activeTab === "description" && (
                <TextInput
                  style={[styles.descriptionInput]}
                  placeholder="First Name"
                  placeholderTextColor="#666"
                  multiline={true}
                  numberOfLines={10}
                  // value={form.first_name}
                  // onChangeText={(text) => handleChange("first_name", text)}
                />
              )}

              <Pressable style={[styles.addButton]}>
                <Text style={[styles.addButtonText]}>Add transaction</Text>
              </Pressable>
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
    marginTop: 30,
    gap: 40,
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
  activeTab: {
    backgroundColor: COLORS["active-dark-green"],
  },
  tabText: {
    fontFamily: "Aller_Bd",
    letterSpacing: 0.1,
    textTransform: "uppercase",
    fontSize: 12,
  },
  activeTabText: {
    color: "#FFF",
  },
  picker: {
    height: 50,
    width: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
  },
  dropdown: {
    height: 40,
    width: windowWidth * 0.8,
    borderColor: "gray",
    borderBottomWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: "#000",
  },

  icon: {
    marginRight: 5,
  },
  label: {
    // position: "absolute",
    // left: 0,
    // top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: "Aller_Bd",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#000",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  categoryButton: {
    width: windowWidth * 0.8,
    height: 40,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
  descriptionInput: {
    width: windowWidth * 0.7,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#gray",
    borderRadius: 0,
    fontSize: 16,
    backgroundColor: "none",
    paddingLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: COLORS["primary-3"],
    width: windowWidth * 0.8,
    left: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  addButtonText: {
    fontFamily: "Aller_Bd",
    fontSize: 20,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
});

export default addTransaction;
