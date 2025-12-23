import CreateCommentForm from "@/components/comment/CreateCommentForm";
import Card from "@/components/ui/Card";
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
    <div className="flex justify-between">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        <Card object={post} />
        <CreateCommentForm post={post} />
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-5 overflow-y-scroll h-135 scroll-smooth">
        {comments.map((comment: Comment) => (
          <Card key={comment._id} object={comment}/>
        ))}
      </div>
    </div>
  );
}
