import Link from "next/link";
import Navbar from "./navbar/Navbar";
import NavbarItem from "./navbar/NavbarItem";
import Button from "./ui/Button";
import { signOut } from "@/lib/actions";

type User = {
  _id: string;
  username: string;
  email: string;
};

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
        <NavbarItem href="/auth/sign-in" text="sign in" />
      )}
    </header>
  );
}
