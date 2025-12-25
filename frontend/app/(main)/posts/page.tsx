import { getCurrentUser, getPosts } from "@/lib/actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Post } from "@/lib/types";
import PostCard from "@/components/post/PostCard";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const posts = await getPosts();
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col items-center gap-5">
      {posts.map((post: Post) => (
        <PostCard key={post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
