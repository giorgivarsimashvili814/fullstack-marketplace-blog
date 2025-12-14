import SignIn from "@/components/auth/SignIn";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) redirect("/");

  return <SignIn />;
}
