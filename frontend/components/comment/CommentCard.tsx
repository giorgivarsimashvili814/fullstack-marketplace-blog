import Link from "next/link";
import Button from "../ui/Button";
import { Comment, Like } from "@/lib/types";
import { deleteComment, getCurrentUser, getLikes } from "@/lib/actions";
import LikeButton from "../ui/LikeButton";

type Props = {
  comment: Comment;
};

export default async function CommentCard({ comment }: Props) {
  const currentUser = await getCurrentUser();

  const likes = await getLikes("comment", comment._id);

  const likedByMe = likes.some(
    (like: Like) => like.author._id === currentUser?._id
  );

  return (
    <div className="w-full max-w-2xl border rounded-lg p-4 bg-red-300 flex flex-col gap-5">
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
        <Button>reply</Button>
      </div>
      <div>{comment.content}</div>
      {comment.author?._id === currentUser?._id && (
        <div className="flex gap-2.5 items-center">
          <form
            action={deleteComment.bind(null, comment._id, comment.post._id)}
          >
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      )}
      <LikeButton
        initialLiked={likedByMe}
        initialLikes={likes}
        targetId={comment._id}
        targetAuthorId={comment.author._id}
        targetType="comment"
      />
    </div>
  );
}
