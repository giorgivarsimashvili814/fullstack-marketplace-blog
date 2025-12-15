import CreatePostForm from "@/components/post/CreatePostForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  return (
    <div className="flex items-center justify-center">
      <CreatePostForm />;
    </div>
  );
}
