"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { User, AuthContextType } from "@/types";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [authUser, setAuthUser] = useState<User | null>(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);

  const signOut = async () => {
    await axiosInstance.post("/auth/sign-out");
    setAuthUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    redirect("/");
  };

  return (
    <AuthContext.Provider
      value={{ authUser, isLoggedIn, loading: false, signOut }}
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
