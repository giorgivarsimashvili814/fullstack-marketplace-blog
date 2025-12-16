import EditPostForm from "@/components/post/EditPostForm";
import { getPost } from "@/lib/actions";
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

  return (
    <div className="flex items-center justify-center">
      <EditPostForm post={post} />;
    </div>
  );
}
