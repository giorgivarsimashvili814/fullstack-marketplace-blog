import Link from "next/link";
import Button from "../ui/Button";
import { Comment} from "@/lib/types";

type Props = {
  comment: Comment
}

export default async function CommentCard( {comment} : Props) {
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
    </div>
  );
}
