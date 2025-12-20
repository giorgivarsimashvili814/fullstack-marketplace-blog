import PostCard from "@/components/post/PostCard";
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
      {posts.map((post:Post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
}
