import EditReplyForm from "@/components/reply/EditReplyForm";
import { getReply } from "@/lib/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ replyId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const replyId = (await params).replyId;
  const reply = await getReply(replyId);

  return (
    <div className="flex items-center justify-center">
      <EditReplyForm reply={reply} authorId={reply.author._id} />;
    </div>
  );
}
