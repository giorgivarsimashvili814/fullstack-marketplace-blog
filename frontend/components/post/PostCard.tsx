import { deletePost, getCurrentUser, getLikes } from "@/lib/actions";
import Link from "next/link";
import Button from "../ui/Button";
import AppLink from "../ui/AppLink";
import { Like, Post } from "@/lib/types";
import LikeButton from "../ui/LikeButton";

type Props = {
  post: Post;
};

export default async function PostCard({ post }: Props) {
  const currentUser = await getCurrentUser();

  const likes = await getLikes("post", post._id);
  
  const likedByMe = likes.some(
    (like: Like) => like.author._id === currentUser?._id
  );

  return (
    <div className="w-full max-w-2xl border rounded-lg p-4 flex flex-col gap-5 ">
      <div className="flex justify-between">
        <Link
          href={`/users/${post.author?._id}`}
          className="flex gap-2.5 items-center"
        >
          <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
            {post.author?.username[0].toUpperCase()}
          </div>
          <h2>{post.author?.username}</h2>
        </Link>

        {post.author?._id === currentUser?._id && (
          <div className="flex gap-2.5 items-center">
            <AppLink href={`/posts/edit/${post._id}`}>edit</AppLink>
            <form action={deletePost.bind(null, post._id, currentUser._id)}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>
      <Link href={`/posts/${post._id}`}>
        <div className="flex flex-col gap-2.5 cursor-pointer">
          <h3 className="text-2xl">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      </Link>
      <div className="flex gap-5">
        <LikeButton
          initialLiked={likedByMe}
          initialLikes={likes}
          targetId={post._id}
          targetAuthorId = {post.author._id}
          targetType="post"
        />
        <AppLink href={`/posts/comment/${post._id}`}>comment</AppLink>
      </div>
    </div>
  );
}
