import Card from "@/components/ui/Card";
import CreateReplyForm from "@/components/reply/CreateReplyForm";
import { getComment, getRepliesByComment } from "@/lib/actions";
import { Reply } from "@/lib/types";
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
        <Card object={comment} />
        <CreateReplyForm comment={comment} />
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-5 overflow-y-scroll h-135">
        {replies.map((reply: Reply) => (
          <Card key={reply._id} object={reply} />
        ))}
      </div>
    </div>
  );
}
