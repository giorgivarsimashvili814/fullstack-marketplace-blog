import Link from "next/link";
import Button from "../ui/Button";
import {  Like, Reply } from "@/lib/types";
import { deleteReply, getCurrentUser, getLikes } from "@/lib/actions";
import LikeButton from "../ui/LikeButton";
import AppLink from "../ui/AppLink";

type Props = {
  reply: Reply;
};

export default async function ReplyCard({ reply }: Props) {
  const currentUser = await getCurrentUser();

  const isAuthor = reply.author?._id === currentUser?._id

  const likes = await getLikes("reply", reply._id);

  const likedByMe = likes.some(
    (like: Like) => like.author._id === currentUser?._id
  );

  return (
    <div className="w-full max-w-2xl border-2 rounded-lg p-4 flex flex-col gap-5 bg-white">
      <div className="flex justify-between">
        <Link
          href={`/users/${reply.author?._id}`}
          className="flex gap-2.5 items-center"
        >
          <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
            {reply.author?.username[0].toUpperCase()}
          </div>
          <h2>{reply.author?.username}</h2>
        </Link>

        {isAuthor && (
          <div className="flex gap-2.5 items-center">
            <AppLink href={`/replies/edit/${reply._id}`}>edit</AppLink>
            <form
              action={deleteReply.bind(null, reply._id, reply.comment._id)}
            >
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>
        <div className="flex flex-col gap-2.5 cursor-pointer min-h-27.5">
          <p className="overflow-wrap wrap-break-word">{reply.content}</p>
        </div>
      <div className="flex gap-2.5">
        <LikeButton
          initialLiked={likedByMe}
          initialLikes={likes}
          targetId={reply._id}
          targetAuthorId={reply.author._id}
          targetType="reply"
        />
        {/* <AppLink href={`/comments/${reply.comment._id}`}>reply</AppLink> */}
      </div>
    </div>
  );
}
