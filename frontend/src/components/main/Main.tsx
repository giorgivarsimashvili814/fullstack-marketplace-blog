"use client";
import { useAuth } from "@/context/AuthContext";

export default function Main() {
  const { loading, authUser } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-[1000px] w-full flex justify-center">
      <div className="max-w-[1440px] w-full px-4 py-12">
        <h1 className="mb-2.5 text-2xl">Home</h1>
        {authUser && (
          <p className="mb-2.5">
            welcome back{" "}
            <strong className="text-lg">{authUser?.username}</strong>!
          </p>
        )}
      </div>
    </div>
  );
}
