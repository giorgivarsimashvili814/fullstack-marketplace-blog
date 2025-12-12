import { getPosts } from "../serverActions";
import PostCard from "./PostCard";

export default async function PostsList() {
  const posts = await getPosts();
  return (
    <div className="w-full max-w-[1440px] px-4 py-12">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
