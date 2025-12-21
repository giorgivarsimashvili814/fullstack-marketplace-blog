import EditCommentForm from "@/components/comment/EditCommentForm";
import { getComment } from "@/lib/actions";
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

  return (
    <div className="flex items-center justify-center">
      <EditCommentForm comment={comment} authorId={comment.author._id} />;
    </div>
  );
}
