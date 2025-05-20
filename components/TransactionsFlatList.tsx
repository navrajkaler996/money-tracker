import React from "react";
import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";

import { getMonth, MONTHS } from "@/utils/constants";

const windowWidth = Dimensions.get("window").width;

interface Transaction {
  accountType: "cash" | "debit" | "credit";
  bankName: string | null;
  categoryName: string;
  description: string;
  transactionAmount: number;
  transactionDay: number;
  transactionMonth: string;
}

interface TransactionsFlatListProps {
  data: Transaction[];
  limit: number;
}

//Component to render list of transactions
const TransactionsFlatList: React.FC<TransactionsFlatListProps> = ({
  data,
  limit = -1,
}) => {
  const limitedData = limit > 0 ? data.slice(0, limit) : data;
  return (
    <FlatList
      data={limitedData} // assuming you have a data source like this
      // keyExtractor={(item) => item.id.toString()} // assuming each transaction has a unique id
      renderItem={({ item }) => (
        <View style={styles.transactionItem}>
          <View style={styles.day}>
            <Text style={styles.textNumbers}>{item.transactionDay}</Text>
            <Text style={{ ...styles.textHeading, fontSize: 16 }}>
              {getMonth(item.transactionMonth)}
            </Text>
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.categoryText}>{item.categoryName}</Text>
            {item.accountType ? (
              <Text style={styles.accountNameText}>
                {item.accountType !== "cash"
                  ? `${item.bankName} - ${item.accountType}`
                  : item.accountType}
              </Text>
            ) : (
              <Text style={styles.accountNameText}></Text>
            )}

            <Text style={styles.accountNumberText}>{item.description}</Text>
            <Text style={styles.amountText}>-${item.transactionAmount}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    width: windowWidth * 0.9,
    minHeight: 70,
    flexDirection: "row",
    marginBottom: 30,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  day: {
    flex: 1.5,
    alignItems: "center",
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
    position: "absolute",
    top: 5,
    right: 10,
  },
  accountNameText: {
    fontFamily: "Aller_Rg",
    textTransform: "uppercase",
  },
  accountNumberText: {
    fontFamily: "Aller_Rg",
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
});

export default TransactionsFlatList;
