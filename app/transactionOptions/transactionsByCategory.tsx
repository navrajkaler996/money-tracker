import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesByUserIdQuery } from "@/services/categoryApi";
import { useGetTransactionsByCategoryIdQuery } from "@/services/transactionApi";

import { COLORS, MONTHS } from "@/utils/constants";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import TransactionsFlatList from "@/components/TransactionsFlatList";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const TransactionsByCategory = () => {
  const router = useRouter();
  const { categoryId, userId } = useLocalSearchParams();

  const [transaction, setTransaction] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<Number | null>(null);

  const { data: transactionsData, isLoading: transactionIsLoading } =
    useGetTransactionsByCategoryIdQuery({
      userId: userId,
      categoryId: selectedCategory,
    });

  const { data: categoriesData, isLoading: categoriesIsLoading } =
    useGetCategoriesByUserIdQuery(userId);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(userId);

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

  const getMonth = (month: string) => MONTHS[Number(month)];

  useEffect(() => {
    if (transactionsData && categoriesData && accountsData) {
      const result = createTransaction(
        transactionsData,
        categoriesData,
        accountsData
      );

      if (result) setTransaction(result);
    }
  }, [transactionsData, categoriesData, accountsData]);

  useEffect(() => {
    if (categoryId) setSelectedCategory(Number(categoryId));
    else setSelectedCategory(-1);
  }, [categoryId]);

  const handleCategory = (category: any) => {
    setSelectedCategory(category.id);
  };

  const handleAddTransaction = () => {};

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

        <Text style={styles.headerText}>Transactions</Text>

        <Pressable
          style={styles.rightContainer}
          onPress={() => {
            router.push({ pathname: "/transactionOptions/addTransaction" });
          }}>
          <Image
            style={[styles.addTransactionImage]}
            source={require("../../assets/images/icons/add-transaction.png")}
          />
        </Pressable>
      </View>

      <View style={styles.gradientContainer}>
        <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
          <View style={styles.accountContainter}>
            <Text style={styles.textHeading}>Select a category</Text>
            <View style={styles.categoryCapsuleContainer}>
              {selectedCategory !== null &&
                categoriesData?.map((category: any, index: number) => (
                  <Pressable
                    key={index}
                    style={
                      category.id === selectedCategory ||
                      category.id === categoryId
                        ? styles.categoryCapsuleActive
                        : styles.categoryCapsule
                    }
                    onPress={() => handleCategory(category)}>
                    <Text style={styles.categoryCapsuleText}>
                      {category.category_name}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>
        </LinearGradient>
      </View>

      {!transactionIsLoading && transaction?.length > 0 && (
        <View style={styles.transactionListContainer}>
          <View style={styles.transactionGradientContainer}>
            <TransactionsFlatList data={transaction} />
          </View>
        </View>
      )}
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
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
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
  addTransactionImage: {
    width: 30,
    height: 30,
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
    minHeight: 50,
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
    marginTop: 10,
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
    flexDirection: "column",
    // justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  transactionListContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  transactionGradientContainer: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    gap: 20,
  },
  transactionItem: {
    width: windowWidth,
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
    backgroundColor: COLORS["primary-1"],
  },
  transactionInfo: {
    flex: 7,
    gap: 5,
    paddingLeft: 10,
    justifyContent: "center",
    // backgroundColor: "#ddd",
    // borderTopColor: "#ddd",
    // borderTopWidth: 1,
    // borderBottomColor: "#ddd",
    // borderBottomWidth: 1,
  },
  categoryText: {
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
    letterSpacing: 0.1,
  },
  amountText: {
    fontFamily: "Aller_Bd",
    color: "red",
    position: "absolute",
    top: 5,
    right: 10,
  },
  accountNameText: { fontFamily: "Aller_Rg", textTransform: "uppercase" },
  accountNumberText: { fontFamily: "Aller_Rg" },

  categoryCapsuleContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  categoryCapsule: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["primary-3"],
    borderRadius: 20,
  },
  categoryCapsuleActive: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    borderWidth: 0.1,
    borderColor: "#ddd",
    backgroundColor: COLORS["active-yellow"],
    borderRadius: 20,
  },
  categoryCapsuleText: {
    color: "#000",
    fontFamily: "Aller_Rg",
  },
});

export default TransactionsByCategory;
