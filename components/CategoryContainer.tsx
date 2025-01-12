import { StyleSheet, View, Dimensions } from "react-native";
import CategoryCard from "./CategoryCard";

const windowWidth = Dimensions.get("window").width;

type CategoryContainerProps = {
  ledger: any;
};

const CategoryContainer: React.FC<CategoryContainerProps> = ({ ledger }) => {
  return (
    <View style={styles.mainContainer}>
      <CategoryCard ledger={ledger} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 40,
    width: windowWidth * 0.95,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

export default CategoryContainer;
