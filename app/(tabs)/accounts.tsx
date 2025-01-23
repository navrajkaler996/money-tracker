import {
  useGetAccountsQuery,
  useInsertAccountsMutation,
} from "@/services/accountApi";
import { COLORS, STYLES } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AccountsScreen = () => {
  const router = useRouter();

  const { message, status } = useLocalSearchParams();

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
    refetch: accountsRefetch,
  } = useGetAccountsQuery(59);

  const [debitAccounts, setDebitAccounts] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState([]);
  const [cashAccount, setCashAccount] = useState([]);

  useEffect(() => {
    if (accountsData?.length > 0) {
      const debit = accountsData.filter(
        (account: any) => account.account_type === "debit"
      );
      const credit = accountsData.filter(
        (account: any) => account.account_type === "credit"
      );
      const cash = accountsData.filter(
        (account: any) => account.account_type === "cash"
      );

      setDebitAccounts(debit);
      setCreditAccounts(credit);
      setCashAccount(cash);
    }
  }, [accountsData]);

  useFocusEffect(() => {
    accountsRefetch();
  });

  //Showing toast notification when transaction is added
  useEffect(() => {
    if (status === "success") {
      Toast.show({
        type: "success",
        text1: message.toString(),
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 100,
      });
    } else if (status === "failed") {
      Toast.show({
        type: "success",
        text1: message.toString(),
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 100,
      });
    }
  }, [message, status]);

  //Functions

  const handleAddAccount = () => {
    router.push({
      pathname: "/accountOptions/addAccount",
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gradientContainer, STYLES.SHADOW_1]}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.accountInfoContainer}>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Assets</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Net worth</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
            <View style={styles.viewInGradient}>
              <Text style={styles.textHeading}>Liabilities</Text>
              <Text style={styles.textNumbers}>$1000</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.accountContainer}>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountType}>Debit accounts</Text>
        </View>
        {debitAccounts?.map((account: any, i: number) => {
          return (
            <View
              style={
                i !== debitAccounts?.length - 1
                  ? styles.account
                  : [styles.account, { marginBottom: 0 }]
              }>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.bankLogo}
                  source={require("../../assets/images/icons/cibc.png")}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.bankName}>{account.bank_name}</Text>
                <Text style={styles.totalAmount}>${account.total_amount}</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.income}>+$1700</Text>
                  <Text style={styles.expense}>-$978</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.accountContainer}>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountType}>Credit accounts</Text>
        </View>
        {creditAccounts?.map((account: any, i: number) => {
          return (
            <View
              style={
                i !== creditAccounts?.length - 1
                  ? styles.account
                  : [styles.account, { marginBottom: 0 }]
              }>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.bankLogo}
                  source={require("../../assets/images/icons/cibc.png")}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.bankName}>{account.bank_name}</Text>
                <Text style={styles.totalAmount}>
                  ${account.available_credit}
                </Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.income}>+$1700</Text>
                  <Text style={styles.expense}>-$978</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.accountContainer}>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountType}>Cash account</Text>
        </View>
        {cashAccount?.map((account: any, i: number) => {
          return (
            <View
              style={
                i !== cashAccount?.length - 1
                  ? styles.account
                  : [styles.account, { marginBottom: 0 }]
              }>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.bankLogo}
                  source={require("../../assets/images/icons/cibc.png")}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.totalAmount}>${account.total_amount}</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.income}>+$1700</Text>
                  <Text style={styles.expense}>-$978</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        style={[styles.addAccount, STYLES.SHADOW_1]}
        onPress={handleAddAccount}>
        <Image
          source={require("../../assets/images/icons/add-icon.png")}
          style={styles.addAccountIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  gradientContainer: {
    width: windowWidth,

    alignItems: "center",
    justifyContent: "flex-start",
  },
  gradient: {
    width: "100%",
    minHeight: windowHeight * 0.1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  accountInfoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  viewInGradient: {
    width: windowWidth * 0.25,
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
  accountContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  account: {
    width: windowWidth * 0.9,
    height: 70,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    marginBottom: 20,
    flexDirection: "row",
  },
  logoContainer: {
    flex: 2,
  },
  infoContainer: {
    flex: 8,
    gap: 5,
  },
  bankName: {
    fontSize: 16,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.1,
  },
  accountTypeContainer: { width: windowWidth * 0.9, marginBottom: 15 },
  accountType: {
    fontFamily: "Aller_Rg",
    textTransform: "capitalize",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  bankLogo: {
    height: 50,
    width: 50,
  },
  amountContainer: {
    position: "absolute",
    top: 0,
    right: 5,
  },

  totalAmount: {
    fontFamily: "Aller_Rg",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  expense: {
    fontFamily: "Aller_Rg",
    color: COLORS.expense,
    fontSize: 14,
    textAlign: "right",
  },
  income: {
    fontFamily: "Aller_Rg",
    color: COLORS.income,
    fontSize: 14,
    textAlign: "right",
  },
  addAccount: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLORS["primary-3"],
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addAccountIcon: {
    width: 30,
    height: 30,
  },
});

export default AccountsScreen;
