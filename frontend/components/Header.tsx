import Link from "next/link";
import Button from "./ui/Button";
import Navbar from "./navbar/Navbar";

export default function Header() {
  return (
    <header className="w-full sticky top-0 flex justify-between items-center px-4 py-2 border-b bg-white">
      <Link href="/" className="font-bold">
        My Site
      </Link>
      <Navbar />
      <Button variant="destructive">sign out</Button>
      <Button>sign in</Button>
    </header>
  );
}
