import Link from "next/link";
import React from "react";

type Props = {
  isAuthor: boolean;
};

export default function Edit({ isAuthor = false }:Props) {
  return (
    <>
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

        {isAuthor && (
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
        <div className="flex flex-col gap-2.5 cursor-pointer min-h-37.5">
          <h3 className="text-2xl overflow-wrap wrap-break-word">
            {post.title}
          </h3>
          <p className="overflow-wrap wrap-break-word">{post.content}</p>
        </div>
      </Link>
    </>
  );
}
