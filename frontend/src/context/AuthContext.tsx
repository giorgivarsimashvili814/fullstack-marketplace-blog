"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";

type AuthUser = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/current-user");
        setAuthUser(res.data);
        setIsLoggedIn(true);
      } catch {
        setAuthUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signOut = async () => {
    await axiosInstance.post("/auth/sign-out", {});
    setAuthUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoggedIn,
        loading,
        signOut,
      }}
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
