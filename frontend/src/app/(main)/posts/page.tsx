import { cookies } from "next/headers";
import PostsList from "./components/PostsList";
import { redirect } from "next/navigation";

export default async function Posts() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  return <PostsList />;
}
