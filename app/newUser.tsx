import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";

//Components
import SettingOne from "./settingOne";
import SettingTwo from "./settingTwo";

import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/utils/constants";
import { useInsertAccountsMutation } from "@/services/accountApi";
import { useInsertCategoriesMutation } from "@/services/categoryApi";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function NewUserScreen() {
  const router = useRouter();
  //CONTEXT
  const { user } = useAuth();

  const [setting, setSetting] = useState(1);
  const [activeAccount, setActiveAccount] = useState("accounts");
  const [token, setToken] = useState("");
  // State for categories
  const [categories, setCategories] = useState([
    "Grocery",
    "Transport",
    "Dining",
    "Entertainment",
    "Health",
    "Others",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [accounts, setAccounts] = useState<string[]>([]);

  //API for inserting accounts
  const [
    insertAccounts,
    {
      isLoading: insertAccountsIsLoading,
      error: insertAccountsError,
      data: insertAccountsData,
    },
  ] = useInsertAccountsMutation();

  //API for inserting categories
  const [
    insertCategories,
    {
      isLoading: insertCategoriesIsLoading,
      error: insertCategoriesError,
      data: insertCategoriesData,
    },
  ] = useInsertCategoriesMutation();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (insertAccountsIsLoading || insertCategoriesIsLoading)
      setIsLoading(true);

    if (insertAccountsData && insertCategoriesData) {
      router.push({
        pathname: "/(tabs)",
      });
    }
  }, [
    insertAccountsIsLoading,
    insertAccountsError,
    insertAccountsData,
    insertCategoriesData,
    insertCategoriesError,
    insertCategoriesIsLoading,
  ]);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  //Creating payload for insert accounts API
  const createAccountsPayload = (accounts: any) => {
    const payload = accounts.map((account: any) => {
      return {
        account_type: account.type,
        total_amount:
          account.type === "debit" || account.type === "cash"
            ? account.amount
            : null,
        bank_name:
          account.type === "debit" || account.type === "credit"
            ? account.bankName
            : null,
        credit_limit: account.type === "credit" ? account.limit : null,
        available_credit: account.type === "credit" ? account.credit : null,
      };
    });

    return payload;
  };

  const handleSetting = () => {
    if (setting === 3) {
      //creating paylod for insertAccounts API
      const accountsPayload = createAccountsPayload(accounts);

      if (accountsPayload && selectedCategories) {
        const userId = user.userId;

        insertCategories({
          userId,
          payload: selectedCategories,
        });
        insertAccounts({
          userId,
          payload: accountsPayload,
        });
      }

      return;
    }

    let tempsSetting = setting === 3 ? 1 : setting + 1;

    setSetting(tempsSetting);
  };

  const handleAccounts = (activeAccount: any) => {
    setActiveAccount(activeAccount);
  };

  const handleCategory = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter((item) => item !== category);
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory("");
      setShowAddCategory(false);
      setSelectedCategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        newCategory,
      ]);
    } else {
      alert("Please enter a valid, unique category.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Gradient with Heading */}
      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.heading1Container}>
            <Text style={styles.heading1}>Welcome, {user?.first_name}</Text>
            <Text style={styles.heading2}>Set up your Account</Text>
          </View>
          <Image
            style={styles.setupImage}
            source={require("../assets/images/icons/setup.png")}
          />
        </LinearGradient>
      </View>

      {/* Category Selection Container */}
      <View
        style={{ ...styles.getStartedOuterContainer, ...styles.cardShadow }}>
        <LinearGradient
          colors={["#a8ff78", "#78ffd6"]}
          style={styles.getStartedContainer}>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: windowHeight,
              }}>
              <ActivityIndicator size="large" color={COLORS["primary-3"]} />
            </View>
          ) : (
            <>
              <Text style={styles.heading2}>
                {setting === 1
                  ? `Select categories`
                  : setting === 2
                  ? `Select accounts`
                  : `All ready!`}
              </Text>

              <View style={styles.horizontalLine} />
              {/* Category capsules */}
              {setting === 1 && (
                <SettingOne
                  categories={categories}
                  selectedCategories={selectedCategories}
                  handleCategory={handleCategory}
                  showAddCategory={showAddCategory}
                  setShowAddCategory={setShowAddCategory}
                  newCategory={newCategory}
                  setNewCategory={setNewCategory}
                  handleAddCategory={handleAddCategory}
                />
              )}
              {setting === 2 && (
                <SettingTwo
                  activeAccount={activeAccount}
                  setActiveAccount={setActiveAccount}
                  handleAccounts={handleAccounts}
                  accounts={accounts}
                  setAccounts={setAccounts}
                />
              )}
              {setting === 3 && (
                <View style={styles.allReadyImageContainer}>
                  <Image
                    source={require("../assets/images/icons/thumbs-up.png")}
                    style={styles.allReadyImage}
                  />
                  <View style={styles.allReadyTextContainer}>
                    <Text style={styles.allReadyText}>Click on finish</Text>
                    <Text style={styles.allReadyText}>and</Text>
                    <Text style={styles.allReadyText}>
                      Start tracking your money!
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.buttonContainer}>
                <View style={styles.dotIndicatorContainer}>
                  <View
                    style={
                      setting === 1
                        ? { ...styles.dotIndicator, ...styles.activeDot }
                        : styles.dotIndicator
                    }></View>
                  <View
                    style={
                      setting === 2
                        ? { ...styles.dotIndicator, ...styles.activeDot }
                        : styles.dotIndicator
                    }></View>
                  <View
                    style={
                      setting === 3
                        ? { ...styles.dotIndicator, ...styles.activeDot }
                        : styles.dotIndicator
                    }></View>
                </View>
                <Pressable style={styles.button} onPress={handleSetting}>
                  <Text style={styles.buttonText}>
                    {setting === 3 ? "Finish" : "Next"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </LinearGradient>
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
    elevation: 5,
  },
  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.4,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  getStartedOuterContainer: {
    marginTop: -80,
  },
  getStartedContainer: {
    width: windowWidth * 0.8,
    minHeight: windowHeight * 0.5,
    borderRadius: 25,
    alignItems: "center",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
    borderRadius: 10,
  },
  heading1Container: {
    marginTop: 50,
  },
  heading1: {
    textAlign: "center",
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    fontSize: 24,
  },
  heading2: {
    textAlign: "center",
    fontFamily: "Aller_Bd",
    textTransform: "capitalize",
    letterSpacing: 0.5,
    marginTop: 10,
    fontSize: 20,
  },
  horizontalLine: {
    width: "80%",
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 15,
    marginBottom: 15,
  },

  dotIndicatorContainer: {
    flexDirection: "row",
    width: windowWidth,
    justifyContent: "center",
    gap: 10,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: COLORS["primary-3"],
  },
  activeDot: {
    backgroundColor: COLORS["primary-4"],
  },
  setupImage: {
    width: windowWidth * 0.15,
    height: windowHeight * 0.15,
    resizeMode: "contain",
  },
  button: {
    width: windowWidth * 0.7,
    height: 40,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    gap: 20,
    alignItems: "center",
  },
  form: {
    marginTop: 20,
    alignItems: "center",
    gap: 15,
  },
  allReadyImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  allReadyImage: {
    width: 150,
    height: 150,
  },
  allReadyTextContainer: {
    marginTop: 30,
    gap: 5,
  },
  allReadyText: {
    textAlign: "center",
    fontFamily: "Aller_Rg",
    letterSpacing: 0.5,
    fontSize: 16,
    paddingRight: 20,
    paddingLeft: 20,
  },
});

export default NewUserScreen;
