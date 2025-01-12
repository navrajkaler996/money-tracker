import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";

const windowWidth = Dimensions.get("window").width;

type CategoryCardProps = {
  ledger: any;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ ledger }) => {
  return ledger?.length > 0
    ? ledger.map((data: any) => (
        <View style={styles.cardShadow} key={data.id}>
          <LinearGradient
            colors={["#a8ff78", "#78ffd6"]}
            style={styles.cardGradient}>
            <Text style={styles.cardHeading}>{data.category_name}</Text>
            <Image
              source={require("../assets/images/icons/grocery.png")}
              style={styles.icon}
            />
            <Text style={styles.cardNumbers}>${data.total_amount}</Text>
          </LinearGradient>
        </View>
      ))
    : null;
};

const styles = StyleSheet.create({
  cardGradient: {
    width: windowWidth * 0.25,
    height: 130,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
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
  cardHeading: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
  },
  cardNumbers: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    textTransform: "uppercase",
  },
  icon: {
    width: 40,
    height: 40,
    marginVertical: 5,
  },
});

export default CategoryCard;
