"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedWrapper({ children }: { children: ReactNode }) {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/");
    }
  }, [authUser, loading, router]);

  if (loading || !authUser) return <div>Loading...</div>;

  return <>{children}</>;
}
