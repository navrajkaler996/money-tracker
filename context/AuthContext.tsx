import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  token: string | null;
  user: {
    userId: number;
    email: string;
    first_name: string;
  };
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const login = (response: any) => {
    SecureStore.setItemAsync("token", response.access_token);
    SecureStore.setItemAsync("userId", response?.user?.id);
    SecureStore.setItemAsync("first_name", response?.user?.first_name);
    SecureStore.setItemAsync("email", response?.user?.email);

    setToken(response?.access_token);
    setUser({
      userId: response?.user.id,
      first_name: response?.user.first_name,
      email: response?.user.email,
    });
  };

  const logout = () => {
    SecureStore.deleteItemAsync("jwt_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
