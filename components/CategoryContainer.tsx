import { StyleSheet, View, Dimensions } from "react-native";
import CategoryCard from "./CategoryCard";

const windowWidth = Dimensions.get("window").width;

type CategoryContainerProps = {
  ledger: any;
  handleCategory: Function;
};

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  ledger,
  handleCategory,
}) => {
  return (
    <View style={styles.mainContainer}>
      <CategoryCard ledger={ledger} handleCategory={handleCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 40,
    width: windowWidth * 0.9,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default CategoryContainer;
