import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignUp from "./SignUp";

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/");
  }

  return <SignUp />;
}
