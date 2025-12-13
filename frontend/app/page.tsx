import SignIn from "@/components/auth/sign-in/SignIn";
import SignUp from "@/components/auth/sign-up/SignUp";

export default async function page() {
  return (
    <div>
      <div className="w-full flex justify-between">
        <SignUp />
        <SignIn />
      </div>
    </div>
  );
}
