import { Comment } from "@/lib/types";
import LikeButton from "../ui/Like";
import { getCurrentUser, getLikes } from "@/lib/actions";

type Props = {
  comment: Comment;
};

export default async function CommentCard({ comment }: Props) {
  const likes = await getLikes("comment", comment._id);
    const currentUser = await getCurrentUser();
  

  return (
    <div className="w-full max-w-125 rounded-lg p-2 flex flex-col gap-2.5 bg-white shadow">
      {/* card header */}
      <div className="flex gap-2.5 items-center">
        <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
          {comment.author.username[0].toUpperCase()}
        </div>
        <h2>{comment.author.username}</h2>
      </div>
      {/* card main */}
      <p className="overflow-wrap wrap-break-word">{comment.content}</p>
      {/* card footer */}
      <div className="grid grid-cols-2">
        <LikeButton
          currentUserId={currentUser._id}
          likes={likes}
          object={comment}
        />
      </div>
    </div>
  );
}
