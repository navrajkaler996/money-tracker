import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export const checkToken = async () => {
  const storedToken = await SecureStore.getItemAsync("token");

  if (storedToken) {
    try {
      const decoded: any = jwtDecode(storedToken);

      // `exp` is the expiration time in Unix timestamp (seconds)
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (expirationTime < currentTime) {
        // Token has expired
        return false;
      } else {
        // Token is still valid
        return true;
      }
    } catch (error) {
      console.error("Error decoding token", error);
      return false;
    }
  } else {
    // No token found
    return false;
  }
};
