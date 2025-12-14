import Link from "next/link";
import { signUp } from "@/lib/actions";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SignUp() {
  return (
    <form
      action={signUp}
      className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="w-full flex justify-between">
        <h1 className="font-bold">Sign Up</h1>
        <Link href="/auth/sign-in" className="hover:underline">
          Sign In
        </Link>
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="username">Username:</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signup-email">Email:</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="Email"
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signup-password">Password:</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>

      <Button type="submit">Sign Up</Button>
    </form>
  );
}
