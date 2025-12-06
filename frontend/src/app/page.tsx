"use client";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios-instance";
import { User } from "@/types";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const fetchUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resp.data);
      } catch {
        deleteCookie("token");
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  function handleLogout() {
    deleteCookie("token");
    router.push("/auth/sign-in");
    toast.success("logged out successfully");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="mb-2.5 text-2xl">Home</h1>
      <p className="mb-2.5">
        welcome back <strong className="text-lg">{user?.username}</strong>!
      </p>
      <Button variant="destructive" onClick={handleLogout}>
        log out
      </Button>
    </>
  );
}
