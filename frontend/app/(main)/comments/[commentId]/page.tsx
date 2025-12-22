import CommentCard from "@/components/comment/CommentCard";
import CreateCommentForm from "@/components/comment/CreateCommentForm";
import PostCard from "@/components/post/PostCard";
import CreateReplyForm from "@/components/reply/CreateReplyForm";
import ReplyCard from "@/components/reply/ReplyCard";
import {
  getComment,
  getCommentsByPost,
  getPost,
  getRepliesByComment,
} from "@/lib/actions";
import { Comment, Reply } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const commentId = (await params).commentId;
  const comment = await getComment(commentId);
  const replies = await getRepliesByComment(commentId);

  return (
    <div className="flex justify-between">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        <CommentCard comment={comment} />
        <CreateReplyForm comment={comment} />
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-5 overflow-y-scroll h-135">
        {replies.map((reply: Reply) => (
          <ReplyCard key={reply._id} reply={reply} />
        ))}
      </div>
    </div>
  );
}
