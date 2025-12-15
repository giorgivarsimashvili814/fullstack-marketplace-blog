import Link from "next/link";
import Navbar from "./navbar/Navbar";
import Button from "./ui/Button";
import { signOut } from "@/lib/actions";
import { User } from "@/lib/types";
import AppLink from "./ui/AppLink";

interface Props {
  user: User | null;
}

export default async function Header({ user }: Props) {
  return (
    <header className="w-full sticky top-0 flex justify-between items-center px-4 py-2 border-b bg-white">
      <Link href="/" className="font-bold">
        My Site
      </Link>
      <Navbar />
      {user ? (
        <form action={signOut}>
          <Button type="submit" variant="destructive">
            sign out
          </Button>
        </form>
      ) : (
        <AppLink href="/auth/sign-in">Sign In</AppLink>
      )}
    </header>
  );
}
