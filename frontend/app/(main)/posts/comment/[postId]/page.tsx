import CommentCard from "@/components/comment/CommentCard";
import CreateCommentForm from "@/components/comment/CreateCommentForm";
import PostCard from "@/components/post/PostCard";
import { getCommentsByPost, getPost } from "@/lib/actions";
import { Comment } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const postId = (await params).postId;
  const post = await getPost(postId);
  const comments = await getCommentsByPost(postId);

  return (
    <div className="bg-emerald-700 flex justify-between">
      <div className="bg-amber-300 w-full max-w-2xl">
        <PostCard post={post} />
        <CreateCommentForm post={post} />
      </div>
      <div className="bg-red-400 w-full max-w-2xl">
        {comments.map((comment: Comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
