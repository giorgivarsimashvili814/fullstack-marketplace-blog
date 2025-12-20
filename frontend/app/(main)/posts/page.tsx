import PostCard from "@/components/post/PostCard";
import { getPosts } from "@/lib/actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AppLink from "@/components/ui/AppLink";
import { Post } from "@/lib/types";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");
  
  const posts = await getPosts();

  return (
    <div className="grid place-items-center">
      <AppLink className="mb-5" href="/posts/create">
        Add Post
      </AppLink>
      <div className="w-full grid grid-cols-3 gap-5 place-items-center max-xl:grid-cols-2 max-md:grid-cols-1">
        {posts.map((post: Post) => (
          <PostCard
            key={post._id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
