"use client";
import Link from "next/link";
import Item from "./Item";
import { Button } from "../ui/button";
import { redirect, usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { loading, isLoggedIn, setAuthUser, setIsLoggedIn } = useAuth();

  if (loading) return <p>Loading...</p>;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Posts", href: "/posts" },
    { name: "Products", href: "/products" },
  ];

  const handleLogout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);
    deleteCookie("token");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b bg-white">
      <Link href="/" className="font-bold text-2xl">
        ABC
      </Link>

      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Item
            key={link.name}
            href={link.href}
            className={`rounded-md p-2 font-medium ${
              isActive ? "bg-gray-100 " : " hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Item>
        );
      })}

      {isLoggedIn ? (
        <Button variant="destructive" onClick={handleLogout}>
          Log Out
        </Button>
      ) : (
        <Button variant="default" onClick={() => redirect("/auth/sign-in")}>
          Sign In
        </Button>
      )}
    </nav>
  );
}
