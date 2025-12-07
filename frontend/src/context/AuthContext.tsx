"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { axiosInstance } from "@/lib/axios-instance";

type AuthUser = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = getCookie("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/auth/current-user");
        setAuthUser(res.data);
        setIsLoggedIn(true);
      } catch {
        setAuthUser(null);
        setIsLoggedIn(false);
        deleteCookie("token");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, isLoggedIn, setIsLoggedIn, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
