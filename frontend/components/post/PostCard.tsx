import { deletePost, getCurrentUser } from "@/lib/actions";
import { Post } from "@/lib/types";
import Link from "next/link";
import Button from "../ui/Button";
import AppLink from "../ui/AppLink";

export default async function PostCard(post: Post) {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full max-w-2xl border rounded-lg p-4 flex flex-col gap-2.5 ">
      <div className="flex justify-between ">
        <Link
          href={`/users/${currentUser?._id}`}
          className="flex gap-2.5 items-center"
        >
          <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
            {post.author.username[0].toUpperCase()}
          </div>
          <h2>{post.author.username}</h2>
        </Link>

        {post.author._id === currentUser?._id && (
          <div className="flex gap-2.5 items-center">
            <AppLink href={`/posts/edit/${post._id}`}>edit</AppLink>
            <form action={deletePost.bind(null, post._id)}>
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
    </div>
  );
}
