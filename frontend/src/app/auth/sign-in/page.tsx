import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignIn from "./SignIn";

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/");
  }

  return <SignIn />;
}
