import Card from "@/components/ui/Card";
import { getPostsByAuthor } from "@/lib/actions";
import { Post } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const userId = (await params).userId;
  const posts = await getPostsByAuthor(userId);

  return (
    <>
      page for user: {userId}
      {posts.map((post: Post) => (
        <Card key={post._id} object={post}/>
      ))}
    </>
  );
}
