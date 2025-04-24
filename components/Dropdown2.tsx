import { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Dropdown2 = ({
  containerStyle = {},
  placeholder = "Select",
  data,
  onChange,
}) => {
  const [clicked, setClicked] = useState(false);

  return (
    <TouchableOpacity style={[styles.container, containerStyle]}>
      <Pressable
        style={styles.placeholderContainer}
        onPress={() => setClicked(!clicked)}>
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </Pressable>
      {clicked && (
        <View style={styles.menu}>
          {data?.length > 0 &&
            data?.map((d) => {
              return (
                <Pressable
                  onPress={() => {
                    setClicked(false);
                    onChange(d);
                  }}>
                  <Text style={styles.optionText}>{d.label}</Text>
                </Pressable>
              );
            })}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  placeholderContainer: {
    justifyContent: "center",
    height: 40,
    width: windowWidth * 0.8,
    position: "relative",
    zIndex: 9,
  },
  placeholderText: {},
  menu: {
    position: "absolute",
    top: 40,
    backgroundColor: "#fff",
    width: windowWidth * 0.8,
    zIndex: 999,
    height: 1000,
  },
  optionText: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    zIndex: 99,
  },
});

export default Dropdown2;
