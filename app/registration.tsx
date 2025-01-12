import { useCreateUserMutation } from "@/services/userApi";
import { COLORS } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function RegistrationScreen({ navigation }: any) {
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    errors: {
      first_name: false,
      email: false,
      password: false,
    },
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const [createUser, { isLoading, error, data }] = useCreateUserMutation();

  if (isRegistered) return <Redirect href={"/(tabs)"} />;

  const handleChange = (field: any, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
      errors: { ...prevForm.errors, [field]: false },
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      first_name: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (!form.first_name) {
      newErrors.first_name = true;
      valid = false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = true;
      valid = false;
    }
    if (!form.password) {
      newErrors.password = true;
      valid = false;
    }

    setForm((prevForm) => ({
      ...prevForm,
      errors: newErrors,
    }));

    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      createUser({
        email: form.email,
        first_name: form.first_name,
        password: form.password,
      });
      setIsRegistered(true);
    } else {
      console.log("Form is invalid");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={["#a8ff78", "#78ffd6"]}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/icons/money.png")}
            style={styles.image}
          />
          <View style={styles.headingsContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Track your expenses</Text>
              <Image
                source={require("../assets/images/icons/check-mark.png")}
                style={styles["check-mark"]}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Manage your budget</Text>
              <Image
                source={require("../assets/images/icons/check-mark.png")}
                style={styles["check-mark"]}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Create your goals</Text>
              <Image
                source={require("../assets/images/icons/check-mark.png")}
                style={styles["check-mark"]}
              />
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, form.errors.first_name && styles.inputError]}
            placeholder="First Name"
            placeholderTextColor="#666"
            value={form.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
          />
          {form.errors.first_name && (
            <Text style={styles.errorText}>First name is required</Text>
          )}

          <TextInput
            style={[styles.input, form.errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#666"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {form.errors.email && (
            <Text style={styles.errorText}>Please enter a valid email</Text>
          )}

          <TextInput
            style={[styles.input, form.errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          {form.errors.password && (
            <Text style={styles.errorText}>Password is required</Text>
          )}

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
  },
  formContainer: {
    width: windowWidth,
    alignItems: "center",
    gap: 20,
    // position: "absolute",
    // bottom: windowWidth * 0.4,
  },
  input: {
    width: windowWidth * 0.7,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingLeft: 10,
  },
  button: {
    width: windowWidth * 0.7,
    height: 40,
    backgroundColor: COLORS["primary-3"],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Aller_Bd",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  inputError: {
    borderColor: "red",
  },
  imageContainer: {
    alignItems: "center",
    // position: "absolute",
    // top: windowHeight * 0.15,
    gap: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  headingsContainer: {
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: windowWidth * 0.52,
  },
  "check-mark": {
    width: 24,
    height: 24,
  },
  text: {
    fontFamily: "Aller_It",
    fontSize: 20,
    letterSpacing: 0.5,
  },
});

export default RegistrationScreen;
