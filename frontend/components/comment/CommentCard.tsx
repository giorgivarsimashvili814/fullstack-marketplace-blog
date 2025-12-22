import Link from "next/link";
import Button from "../ui/Button";
import { Comment, Like } from "@/lib/types";
import { deleteComment, getCurrentUser, getLikes } from "@/lib/actions";
import LikeButton from "../ui/LikeButton";
import AppLink from "../ui/AppLink";

type Props = {
  comment: Comment;
};

export default async function CommentCard({ comment }: Props) {
  const currentUser = await getCurrentUser();

  const isAuthor = comment.author?._id === currentUser?._id;

  const likes = await getLikes("comment", comment._id);

  const likedByMe = likes.some(
    (like: Like) => like.author._id === currentUser?._id
  );

  return (
    <>
      <div className="w-full max-w-2xl border-2 rounded-lg p-4 flex flex-col gap-5 bg-white">
        <div className="flex justify-between">
          <Link
            href={`/users/${comment.author?._id}`}
            className="flex gap-2.5 items-center"
          >
            <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
              {comment.author?.username[0].toUpperCase()}
            </div>
            <h2>{comment.author?.username}</h2>
          </Link>

          {isAuthor && (
            <div className="flex gap-2.5 items-center">
              <AppLink href={`/comments/edit/${comment._id}`}>edit</AppLink>
              <form
                action={deleteComment.bind(null, comment._id, comment.post._id)}
              >
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          )}
        </div>
        <Link href={`/comments/${comment._id}`}>
          <div className="flex flex-col gap-2.5 cursor-pointer min-h-27.5">
            <p className="overflow-wrap wrap-break-word">{comment.content}</p>
          </div>
        </Link>
        <div className="flex gap-2.5">
          <LikeButton
            initialLiked={likedByMe}
            initialLikes={likes}
            targetId={comment._id}
            targetAuthorId={comment.author._id}
            targetType="comment"
          />
          <AppLink href={`/comments/${comment._id}`}>reply</AppLink>
        </div>
      </div>
    </>
  );
}
