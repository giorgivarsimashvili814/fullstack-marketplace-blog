import { Comment } from "@/lib/types";

type Props = {
  comment: Comment;
};

export default function CommentCard({ comment }: Props) {
  return (
    <div className="w-full max-w-125 rounded-lg p-2 flex flex-col gap-2.5 bg-gray-100 shadow">
      {/* card header */}
      <div className="flex gap-2.5 items-center">
        <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
          {comment.author.username[0].toUpperCase()}
        </div>
        <h2>{comment.author.username}</h2>
      </div>
      {/* card main */}
      <p className="overflow-wrap wrap-break-word">{comment.content}</p>
    </div>
  );
}
