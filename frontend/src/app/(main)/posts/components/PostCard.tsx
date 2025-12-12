"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PostType } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deletePost } from "../actions";

interface Props {
  post: PostType;
}

export default function PostCard({ post }: Props) {
  const { authUser } = useAuth();

  const router = useRouter();

  const handleDelete = async () => {
    const success = await deletePost(post._id);
    if (success) {
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl border rounded-lg p-4 flex flex-col gap-2.5 ">
      <div className="flex justify-between ">
        <div className="flex gap-2.5 items-center">
          <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
            {post.author.username[0].toUpperCase()}
          </div>
          <h2>{post.author.username}</h2>
        </div>

        {post.author._id === authUser?._id && (
          <div className="flex gap-2.5 items-center">
            {/* <Button>edit</Button> */}
            <Button type="submit" onClick={handleDelete}>
              Delete
            </Button>
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
