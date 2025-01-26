import { useGetAccountsQuery } from "@/services/accountApi";
import {
  useGetCategoriesByUserIdQuery,
  useGetCategoriesQuery,
} from "@/services/categoryApi";
import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";
import { COLORS, STYLES } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const CategoriesScreen = () => {
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useGetCategoriesByUserIdQuery(59);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(59);

  const {
    data: transactionsData,
    isLoading: transactionsIsLoading,
    error: transactionsError,
  } = useGetTransactionsByUserIdQuery({
    userId: 59,
    month: 1,
    year: 2025,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesData && transactionsData) {
      const categoriesTemp = categoriesData?.map((category: any) => {
        return {
          categoryName: category.category_name,
          categoryId: category.id,
        };
      });

      categoriesTemp.forEach((category) => {
        let totalAmount = 0;
        transactionsData?.forEach((transaction) => {
          if (transaction.category_id === category.categoryId) {
            totalAmount = totalAmount + transaction.transaction_amount;
          }
        });

        category.totalAmount = totalAmount;
        totalAmount = 0;
      });
      setCategories(categoriesTemp);
    }
  }, [categoriesData, transactionsData]);

  return (
    <View style={styles.container}>
      <View style={[styles.gradientContainer, STYLES.SHADOW_1]}>
        {/* <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={styles.gradient}>
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
        </LinearGradient> */}
      </View>
      <View style={styles.categoryContainer}>
        {categories &&
          categories.map((category: any) => {
            return (
              <View style={styles.category}>
                <View style={styles.logoContainer}>
                  <Image
                    style={styles.bankLogo}
                    source={require("../../assets/images/icons/grocery.png")}
                  />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.categoryName}>
                    {category.categoryName}
                  </Text>
                  <Text style={styles.totalAmount}>
                    ${category.totalAmount}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/images/icons/more.png")}
                  style={styles.moreIcon}
                />
              </View>
            );
          })}
      </View>
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
  categoryContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  category: {
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
  categoryName: {
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
    height: 40,
    width: 40,
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
  moreIcon: {
    width: 20,
    height: 20,
    color: "#ddd",
  },
});

export default CategoriesScreen;
