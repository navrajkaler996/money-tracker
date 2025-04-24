import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";
import { useCreateTransactionByUserIdMutation } from "@/services/transactionApi";

import AddTransactionSkeleton from "@/components/skeletons/addTransactionSkeleton";

import { ACCOUNT_TYPES, COLORS } from "@/utils/constants";
import RadioGroup from "@/components/RadioGroup";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

//Component to add a transaction
const addTransaction = () => {
  const accountTypes = ["debit", "credit", "cash"];
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  //Fetching accounts using userId API
  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(userId);

  //Fetching categories using userId API
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useGetCategoriesByUserIdQuery(userId);

  //Creating transaction API
  const [
    createTransaction,
    {
      isLoading: createTransactionIsLoading,
      error: createTransactionError,
      data: createTransactionData,
    },
  ] = useCreateTransactionByUserIdMutation();

  //Final data for API
  const [transaction, setTransaction] = useState({
    transaction_amount: 0,
    account_id: null,
    category_id: null,
    description: "",
  });

  //State for active tab
  const [activeTab, setActiveTab] = useState("account");

  //List of banks for account dropwdown
  const [banks, setBanks] = useState([]);
  //Selected account from first dropwdown
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  //Final data for second dropdown
  const [banksDropdownData, setBanksDropdownData] = useState<any>([]);
  //List of categorues for category dropwdown
  const [categoriesDropdownData, setCategoriesDropdownData] = useState([]);
  //State to show loader when form is submitted
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const [filteredBanks, setFilteredBanks] = useState([]);

  const [isFocus, setIsFocus] = useState(false);

  //USEEEFECTS

  //Initializing transaction
  useEffect(() => {
    setTransaction({
      transaction_amount: 0,
      account_id: null,
      category_id: null,
      description: "",
    });
  }, []);

  //Creating data for dropdowns in account tab
  /////using accountsData from API
  useEffect(() => {
    if (accountsData) {
      const tempBanks = accountsData
        ?.filter((account: any) => {
          return account.bank_name !== null && account.bank_name !== undefined;
        })
        .map((account: any) => ({
          accountType: account.account_type,
          bankName: account.bank_name,
          accountId: account.account_id,
        }));

      setBanks(tempBanks);
    }
  }, [accountsData]);

  useEffect(() => {
    // if (activeTab === "account" && sel) setSelectedAccountType(null);
  }, [activeTab]);

  //Creating data for dropdown in categoru tab
  /////using categoriesData from API
  useEffect(() => {
    if (categoriesData) {
      const tempCategories = categoriesData?.map((category: any) => {
        return {
          label: category.category_name,
          value: category.id,
        };
      });

      setCategoriesDropdownData(tempCategories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (selectedAccountType !== null && banks?.length > 0) {
      const tempFilteredBanks = banks
        .filter((bank: any) => bank.accountType === selectedAccountType)
        .map((bank: any) => ({
          label: bank.bankName,
          value: bank.accountId,
          ...bank,
        }));

      if (tempFilteredBanks?.length === 0) {
        Alert.alert(
          "No credit account linked",
          "Please link a credit account."
        );
      }
      setFilteredBanks(tempFilteredBanks);
    }
  }, [selectedAccountType]);

  console.log(filteredBanks);

  //FUNCTIONS
  const handlePress = (value: string) => {
    setActiveTab(value);
  };

  //Rendering labels for dropdowns
  const renderLabel = (label: string) => {
    return <Text style={[styles.label]}>{label}</Text>;
  };

  //Handles first dropdown
  const handleAccountType = (item: any) => {
    //Creating data for second dropdown
    if (item === "debit" || item === "credit") {
      let tempData = banks.filter((bank: any) => bank?.accountType === item);

      if (tempData?.length > 0) {
        let banksDataForDropdown = tempData?.map((t: any) => {
          return {
            label: t.bankName,
            value: t.accountId,
          };
        });
        //Setting state for second dropwdown
        setBanksDropdownData(banksDataForDropdown);
      }
    } else {
      //If cash is selected in first dropdown
      /////directly fetch cash account id
      const cashAccountId = accountsData?.find(
        (account: any) => account.account_type === "cash"
      );

      //Setting cash account id as final account id
      setTransaction((prev: any) => {
        return {
          ...prev,
          account_id: cashAccountId.account_id,
        };
      });
    }

    //Setting selected value for first dropwdown
    setSelectedAccountType(item?.toLowerCase());
  };

  //Handle form submit
  const handleAddTransaction = () => {
    if (transaction.transaction_amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid transaction amount.");
      return;
    }

    if (transaction.account_id === null) {
      Alert.alert("Missing Account", "Please select an account.");
      return;
    }

    if (transaction.category_id === null) {
      Alert.alert("Missing Category", "Please select a category.");
      return;
    }

    setSubmitIsLoading(true);

    createTransaction({
      userId,
      payload: transaction,
    })
      .then(() => {
        setSubmitIsLoading(false);
        router.push({
          pathname: "/(tabs)",
          params: {
            status: "success",
            message: "Transaction added!",
          },
        });
      })
      .catch((error) => {
        setSubmitIsLoading(false);

        router.push({
          pathname: "/(tabs)",
          params: {
            status: "failed",
            message: "Failed to add transaction!",
          },
        });
      });
  };

  if (accountsIsLoading || categoriesIsLoading) {
    return <AddTransactionSkeleton />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              placeholder="0"
              style={styles.textInput}
              value={transaction.transaction_amount.toString()}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, "");

                if (numericValue === "" || numericValue === "$") {
                  setTransaction((prev) => ({
                    ...prev,
                    transaction_amount: 0,
                  }));
                } else {
                  setTransaction((prev) => ({
                    ...prev,
                    transaction_amount: parseFloat(numericValue),
                  }));
                }
              }}
              keyboardType="numeric"
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
                    <View>
                      {renderLabel("Select an account")}
                      <RadioGroup
                        values={accountTypes}
                        radioGroupStyles={{
                          flexDirection: "row",
                          width: windowWidth * 0.8,
                          justifyContent: "space-around",
                          marginTop: 10,
                        }}
                        containerStyles={{
                          borderBottomColor: "gray",
                          borderBottomWidth: 0.5,
                        }}
                        radioButtonColor={COLORS["active-dark-green"]}
                        selected={selectedAccountType}
                        onSelected={handleAccountType}
                      />
                      {/* <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={ACCOUNT_TYPES}
                        onChange={function (item: any): void {
                          console.log("----changed");
                          handleAccountType(item);
                        }}
                        maxHeight={300}
                        labelField={"label"}
                        valueField={"value"}></Dropdown>
                    </View> */}
                    </View>
                    {selectedAccountType !== null &&
                      selectedAccountType !== "cash" &&
                      filteredBanks?.length > 0 && (
                        <View>
                          {renderLabel("Select your bank")}
                          <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={filteredBanks}
                            onChange={function (item: any): void {
                              setTransaction((prev: any) => {
                                return {
                                  ...prev,
                                  account_id: item.value,
                                };
                              });
                            }}
                            maxHeight={300}
                            labelField={"label"}
                            valueField={"value"}></Dropdown>
                        </View>
                      )}
                  </>
                )}
                {activeTab === "category" && (
                  <>
                    <View>
                      {renderLabel("Select a category")}

                      <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categoriesDropdownData}
                        onChange={function (item: any): void {
                          setTransaction((prev: any) => {
                            return {
                              ...prev,
                              category_id: item.value,
                            };
                          });
                        }}
                        maxHeight={300}
                        labelField={"label"}
                        valueField={"value"}
                        onFocus={() => setIsFocus(true)}></Dropdown>
                    </View>
                    <Pressable style={styles.categoryButton}>
                      <Text style={styles.categoryButtonText}>
                        Add category
                      </Text>
                    </Pressable>
                  </>
                )}
                {activeTab === "description" && (
                  <TextInput
                    style={[styles.descriptionInput]}
                    placeholder="Add a description"
                    placeholderTextColor="#666"
                    multiline={true}
                    // numberOfLines={10}
                    value={transaction.description}
                    onChangeText={(text) =>
                      setTransaction({ ...transaction, description: text })
                    }
                  />
                )}

                <Pressable
                  style={[styles.addButton]}
                  onPress={handleAddTransaction}>
                  {submitIsLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[styles.addButtonText]}>Add transaction</Text>
                  )}
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 60,
    height: 90,
    textAlign: "center",
  },
  currencySymbol: {
    fontSize: 60,
  },
  amountContainer: {
    flex: 4,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
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
    width: windowWidth * 0.8,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#gray",
    borderRadius: 0,
    fontSize: 16,
    paddingHorizontal: 8,
    backgroundColor: "none",
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
