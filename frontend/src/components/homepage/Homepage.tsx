"use client";
import { useAuth } from "@/context/AuthContext";

export default function Homepage() {
  const { loading, authUser } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-[1440px] px-4 py-12">
      {authUser && (
        <p>
          welcome back <strong className="text-lg">{authUser?.username}</strong>
          !
        </p>
      )}
    </div>
  );
}
