import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

import {
  useCreateUserMutation,
  useLoginUserMutation,
} from "@/services/userApi";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { useAuth } from "@/context/AuthContext";
import { COLORS, ERRORS, STYLES } from "@/utils/constants";
import { checkToken } from "@/utils/helpers";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function WelcomeScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // API to register user
  const [
    createUser,
    { isLoading: isCreatingUser, error: createUserError, data: createUserData },
  ] = useCreateUserMutation();

  // API to login user
  const [
    loginUser,
    { isLoading: isLoggingIn, error: loginUserError, data: loginUserData },
  ] = useLoginUserMutation();

  // States for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Errors for form
  const [errors, setErrors] = useState({
    email: null as string | null,
    firstName: null as string | null,
    password: null as string | null,
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [registerAnim] = useState(new Animated.Value(0));
  const [loginAnim] = useState(new Animated.Value(0));

  // USEEFFECTS

  useEffect(() => {
    const handleCheckToken = async () => {
      const isValid = await checkToken();
      if (isValid) {
        router.push({
          pathname: "/(tabs)",
        });
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("email");
        console.log("Token is expired or not found");
      }
    };
    handleCheckToken();
  }, []);

  // Handle API errors
  useEffect(() => {
    if (createUserError) {
      const errorMessage =
        "data" in createUserError &&
        createUserError.data &&
        typeof createUserError.data === "object" &&
        "message" in createUserError.data
          ? (createUserError.data as { message: string }).message
          : "Failed to create account. Please try again.";
      setGlobalError(errorMessage);
    } else if (loginUserError) {
      const errorMessage =
        "data" in loginUserError &&
        loginUserError.data &&
        typeof loginUserError.data === "object" &&
        "message" in loginUserError.data
          ? (loginUserError.data as { message: string }).message
          : "Failed to log in. Please check your credentials.";
      setGlobalError(errorMessage);
    } else {
      setGlobalError(null);
    }
  }, [createUserError, loginUserError]);

  // Handle successful registration or login
  useEffect(() => {
    if (isRegistered && createUserData?.access_token) {
      login(createUserData);
      router.push({
        pathname: "/newUser",
        params: {
          user: JSON.stringify(createUserData),
        },
      });
    } else if (isLoggedIn && loginUserData?.access_token) {
      login(loginUserData);
      router.push({
        pathname: "/(tabs)",
        params: {
          user: JSON.stringify(loginUserData),
        },
      });
    }
  }, [createUserData, isRegistered, loginUserData, isLoggedIn]);

  // Validate form inputs
  useEffect(() => {
    validateForm();
  }, [email, password, firstName]);

  // FUNCTIONS

  // Open the view according to the button pressed on welcome screen
  const handleNavigation = (path: string) => {
    setGlobalError(null); // Clear global error on navigation
    if (path === "register") {
      Animated.timing(registerAnim, {
        toValue: windowHeight * 0.8,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(loginAnim, {
        toValue: windowHeight * 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (path === "login") {
      Animated.timing(loginAnim, {
        toValue: windowHeight * 0.8,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(registerAnim, {
        toValue: windowHeight * 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // Function to validate form
  const validateForm = () => {
    const newErrors = {
      email: null as string | null,
      firstName: null as string | null,
      password: null as string | null,
    };

    // Validate firstName (only for registration)
    if (firstName.length === 0) {
      newErrors.firstName = ERRORS.NOT_EMPTY;
    }

    // Validate email
    if (email.length === 0) {
      newErrors.email = ERRORS.NOT_EMPTY;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = ERRORS.INVALID_EMAIL;
    }

    // Validate password
    if (password.length === 0) {
      newErrors.password = ERRORS.NOT_EMPTY;
    } else if (password.length < 6) {
      newErrors.password = ERRORS.SHORT_PASSWORD;
    }

    setErrors(newErrors);
  };

  // Function to handle user sign up
  const handleSignUp = () => {
    if (!errors.email && !errors.firstName && !errors.password) {
      createUser({
        email,
        first_name: firstName,
        password,
      });
      setIsRegistered(true);
    }
  };

  // Function to handle user login
  const handleLogin = () => {
    if (!errors.email && !errors.password) {
      loginUser({
        email,
        password,
      });
      setIsLoggedIn(true);
    }
  };

  // Check if buttons should be disabled
  const isSignUpDisabled =
    !!errors.email ||
    !!errors.firstName ||
    !!errors.password ||
    !email ||
    !firstName ||
    !password;
  const isLoginDisabled =
    !!errors.email || !!errors.password || !email || !password;

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
            onPress={() => handleNavigation("login")}
          />
          <Text>OR</Text>
          <Button
            text="Create a new account"
            onPress={() => handleNavigation("register")}
          />
        </View>
      </LinearGradient>
      <Animated.View
        style={[
          styles.animatedContainer,
          STYLES.SHADOW_1,
          { height: registerAnim },
        ]}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Create an account</Text>
          {globalError && <Text style={styles.errorText}>{globalError}</Text>}
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
              password={true}
            />
          </View>
          <View style={styles.buttonContainer2}>
            <Button
              text="Sign up"
              onPress={handleSignUp}
              disabled={isSignUpDisabled || isCreatingUser}
            />
            <View style={styles.divider} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => handleNavigation("login")}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedContainer,
          STYLES.SHADOW_1,
          { height: loginAnim },
        ]}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Login to your account</Text>
          {globalError && <Text style={styles.errorText}>{globalError}</Text>}
          <View style={styles.inputContainer}>
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
              password={true}
            />
          </View>
          <View style={styles.buttonContainer2}>
            <Button
              text="Login"
              onPress={handleLogin}
              disabled={isLoginDisabled || isLoggingIn}
            />
            <View style={styles.divider} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => handleNavigation("register")}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                  }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
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
    textAlign: "center",
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
