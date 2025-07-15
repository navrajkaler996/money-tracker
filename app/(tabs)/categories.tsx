import CircularButton from "@/components/CircularButton";
import { useAuth } from "@/context/AuthContext";
import { useGetAccountsQuery } from "@/services/accountApi";
import {
  useGetCategoriesByUserIdQuery,
  useGetCategoriesQuery,
} from "@/services/categoryApi";
import { useGetTransactionsByUserIdQuery } from "@/services/transactionApi";
import { COLORS, MONTHS, STYLES } from "@/utils/constants";
import { Picker } from "@react-native-picker/picker";
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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const CategoriesScreen = () => {
  const router = useRouter();

  const { message, status } = useLocalSearchParams();
  const { user, token } = useAuth();
  const { userId } = user;

  const [activePicker, setActivePicker] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
    refetch: categoriesRefetch,
  } = useGetCategoriesByUserIdQuery(userId);

  const {
    data: accountsData,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useGetAccountsQuery(userId);

  const {
    data: transactionsData,
    isLoading: transactionsIsLoading,
    error: transactionsError,
    refetch: transactionRefetch,
  } = useGetTransactionsByUserIdQuery({
    userId: userId,
    month: Number(selectedMonth) ?? null,
    year: Number(selectedYear),
  });

  const [categories, setCategories] = useState([]);

  useFocusEffect(() => {
    categoriesRefetch();
  });

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

  const handleNavigate = () => {
    router.push({
      pathname: "/categoryOptions/addCategory",
    });
  };

  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - 5 + i).toString()
  );

  const handleApplyFilter = () => {
    transactionRefetch();
  };

  const togglePicker = (picker) => {
    setActivePicker(activePicker === picker ? null : picker);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gradientContainer, STYLES.SHADOW_1]}></View>
      <View style={styles.filterContainer}>
        <View style={styles.filterButtonContainer}>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => togglePicker("month")}>
              <Text style={styles.pickerLabel}>
                {selectedMonth ? MONTHS[selectedMonth - 1] : "Month"}
              </Text>
            </TouchableOpacity>
            {activePicker === "month" && (
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => {
                  setSelectedMonth(itemValue);
                  setActivePicker(null); // Hide picker after selection
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}>
                <Picker.Item label="None" value={null} />
                {MONTHS.map((month, index) => (
                  <Picker.Item label={month} value={index + 1} key={month} />
                ))}
              </Picker>
            )}
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => togglePicker("year")}>
              <Text style={styles.pickerLabel}>{selectedYear || "Year"}</Text>
            </TouchableOpacity>
            {activePicker === "year" && (
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => {
                  setSelectedYear(itemValue);
                  setActivePicker(null); // Hide picker after selection
                }}
                style={
                  activePicker === "year" ? { ...styles.picker } : styles.picker
                }
                itemStyle={styles.pickerItem}>
                {years.map((year) => (
                  <Picker.Item label={year} value={year} key={year} />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handleApplyFilter}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryContainer}>
        {categories &&
          categories.map((category: any) => {
            return (
              <View style={styles.category} key={category.categoryName}>
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
      <CircularButton onPress={handleNavigate} />
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: windowWidth * 0.9,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  filterButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  pickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: windowWidth * 0.3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  pickerLabel: {
    fontFamily: "Aller_Rg",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    color: "#333",
    marginBottom: 2,
    paddingVertical: 8,
    textAlign: "center",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%",
    marginTop: 30,
    color: "#333",
  },
  pickerItem: {
    fontFamily: "Aller_Rg",
    fontSize: 14,
    color: "#000",
    backgroundColor: "#f0f0f0",
    zIndex: 10000,
    width: windowWidth * 0.3,
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: "Aller_Rg",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    color: "#333",
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
  totalAmount: {
    fontFamily: "Aller_Rg",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  bankLogo: {
    height: 40,
    width: 40,
  },
  moreIcon: {
    width: 20,
    height: 20,
    color: "#ddd",
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
  accountTypeContainer: {
    width: windowWidth * 0.9,
    marginBottom: 15,
  },
  accountType: {
    fontFamily: "Aller_Rg",
    textTransform: "capitalize",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  amountContainer: {
    position: "absolute",
    top: 0,
    right: 5,
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

export default CategoriesScreen;
