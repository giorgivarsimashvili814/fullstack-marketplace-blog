"use client";
import Homepage from "@/components/homepage/Homepage";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { loading } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Homepage />
    </>
  );
}
