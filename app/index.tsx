import { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useCreateUserMutation } from "@/services/userApi";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { useAuth } from "@/context/AuthContext";
import { COLORS, ERRORS, STYLES } from "@/utils/constants";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function WelcomeScreen() {
  const router = useRouter();
  const { login } = useAuth();

  //API to register user
  const [createUser, { isLoading, error, data: createUserData }] =
    useCreateUserMutation();

  //States for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  //Errors for form
  const [errors, setErrors] = useState({
    email: null,
    firstName: null,
    password: null,
  });

  const [isRegistered, setIsRegistered] = useState(false);

  const [heightAnim] = useState(new Animated.Value(0));

  //USEEFFECTS

  //useEffect to store token in context
  /////and navigate to newUser screen
  /////Triggers when user creates a new account
  useEffect(() => {
    if (isRegistered && createUserData?.access_token) {
      login(createUserData);

      router.push({
        pathname: "/newUser",
        params: {
          user: createUserData,
        },
      });
    }
  }, [createUserData, isRegistered]);

  //useEffect to track if info in input fields is valid or not
  useEffect(() => {
    validateForm();
  }, [email, password, firstName]);

  //FUNCTIONS

  //Open the view according to the button pressed on welcome screen
  const handleNAvigation = (path: string) => {
    Animated.timing(heightAnim, {
      toValue: windowHeight * 0.8,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  //Function to validate form
  const validateForm = () => {
    let error = false;
    if (errors.firstName === null && firstName?.length === 0) return;
    else {
      if (firstName?.length < 1) {
        setErrors((prev: any) => {
          return {
            ...prev,
            firstName: ERRORS.NOT_EMPTY,
          };
        });
        error = true;
      } else {
        setErrors((prev: any) => {
          return {
            ...prev,
            firstName: false,
          };
        });
        error = false;
      }
    }

    if (errors.email === null && email?.length === 0) return;
    else {
      if (email?.length < 1) {
        setErrors((prev: any) => {
          return {
            ...prev,
            email: ERRORS.NOT_EMPTY,
          };
        });
        error = true;
      } else {
        setErrors((prev: any) => {
          return {
            ...prev,
            email: false,
          };
        });
        error = false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors((prev: any) => {
          return {
            ...prev,
            email: ERRORS.INVALID_EMAIL,
          };
        });
        error = true;
      } else {
        setErrors((prev: any) => {
          return {
            ...prev,
            email: false,
          };
        });
        error = false;
      }
    }

    if (errors.password === null && password?.length === 0) return;
    else {
      if (password?.length < 6) {
        setErrors((prev: any) => {
          return {
            ...prev,
            password: ERRORS.SHORT_PASSWORD,
          };
        });
        error = true;
      } else {
        setErrors((prev: any) => {
          return {
            ...prev,
            password: false,
          };
        });
        error = false;
      }
    }

    return error;
  };

  //Function to handle user sign up, i.e. create a new account
  const handleSignUp = () => {
    if (!errors.email && !errors.firstName && !errors.password) {
      createUser({
        email: email,
        first_name: firstName,
        password: password,
      });
      setIsRegistered(true);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={["#a8ff78", "#78ffd6"]}>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("../assets/images/icons/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Login"
            buttonStyles={{
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
          <Text>OR</Text>
          <Button
            text="Create a new account"
            onPress={() => {
              handleNAvigation("register");
            }}
          />
        </View>
      </LinearGradient>
      <Animated.View
        style={[
          styles.animatedContainer,
          STYLES.SHADOW_1,
          { height: heightAnim },
        ]}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Create an account</Text>
          <View style={styles.inputContainer}>
            <Input
              label="First name"
              placeholder="Enter first name..."
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
            />
            <Input
              label="Email"
              placeholder="Enter email..."
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="Enter password..."
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
          </View>
          <View style={styles.buttonContainer2}>
            <Button
              text="Sign up"
              onPress={handleSignUp}
              disabled={
                errors.email ||
                errors.firstName ||
                errors.password ||
                errors.email === null ||
                errors.firstName === null ||
                errors.password === null
                  ? true
                  : false
              }
            />
            <View style={styles.divider}></View>
            <Text>Already have a account? Login</Text>
          </View>
        </View>
      </Animated.View>
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
  },
  formContainer: {
    width: windowWidth,
    flex: 1,
    alignItems: "center",
    gap: 50,
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
    position: "absolute",
    top: 150,
    gap: 30,
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    fontFamily: "Aller_It",
    fontSize: 20,
    letterSpacing: 0.5,
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
  logo: {
    width: 300,
    height: 300,
  },
  buttonContainer: {
    alignItems: "center",
    gap: 20,
    flex: 0.4,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  buttonContainer2: {
    alignItems: "center",
    gap: 20,

    justifyContent: "flex-end",
  },
  logoContainer: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  animatedContainer: {
    width: windowWidth,
    height: windowHeight * 0,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  heading: {
    fontFamily: "Aller_Rg",
    fontSize: 28,
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 0.1,
  },
  inputContainer: {
    alignItems: "center",
    gap: 10,
  },
  divider: {
    width: windowWidth * 0.8,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});

export default WelcomeScreen;
