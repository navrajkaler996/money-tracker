import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Input from "@/components/Input";

import { COLORS, ERRORS } from "@/utils/constants";
import RadioGroup from "@/components/RadioGroup";
import Dropdown from "@/components/Dropdown";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useInsertAccountsMutation } from "@/services/accountApi";
import { useNavigation, useRouter } from "expo-router";
import { useInsertCategoriesMutation } from "@/services/categoryApi";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const addAccount = () => {
  const router = useRouter();

  //API for inserting categories
  const [
    insertCategories,
    {
      isLoading: insertCategoriesIsLoading,
      error: insertCategoriesError,
      data: insertCategoriesData,
    },
  ] = useInsertCategoriesMutation();

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (insertCategoriesData) {
      router.push({
        pathname: "/(tabs)/categories",
        params: {
          status: "success",
          message: "category added!",
        },
      });
    }
  }, [insertCategoriesIsLoading, insertCategoriesData]);

  const handleAddCategory = () => {
    if (categoryName?.length > 0)
      insertCategories({ userId: 59, payload: [categoryName] });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.leftContainer}>
            <Image
              source={require("../../assets/images/icons/back.png")}
              style={styles.goBackImage}
            />
          </Pressable>

          <Text style={styles.headerText}>Add Category</Text>

          <View style={styles.rightContainer}></View>
        </View>
        <View style={styles.formContainer}>
          <Input
            label={"Enter category name"}
            placeholder={"Enter category name..."}
            numeric={false}
            onChangeText={setCategoryName}
            // error={errors.bankName}
            value={categoryName}
          />

          <Button
            text="Add category"
            buttonStyles={{}}
            onPress={handleAddCategory}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
    width: windowWidth * 0.8,
    marginTop: windowHeight * 0.15,
    gap: 25,
  },
});

export default addAccount;
