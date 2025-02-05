import { createContext, useState, useContext, useEffect, ReactNode} from "react";

import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
} from "../api/auth.ts";
import { User, Register, Login } from "../types/user.ts";
import Cookies from "js-cookie";

interface AuthContextType {
  signUp: (user: Register) => Promise<void>;
  singIn: (user: Login) => Promise<void>;
  loading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  errors: string[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const signUp = async (user: Register) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      setErrors(error.response.data);
    }
  };

  const singIn = async (user: Login) => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (Array.isArray((error as any).response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      console.log(cookies);

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest();
        if (!res.data) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signUp, singIn, loading, user, isAuthenticated, errors, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
