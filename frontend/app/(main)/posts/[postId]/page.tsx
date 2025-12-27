import CommentCard from "@/components/comment/CommentCard";
import PostCard from "@/components/post/PostCard";
import { getCommentsByPost, getCurrentUser, getPost } from "@/lib/actions";
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

  if (!token) {
    redirect("/");
  }

  const postId = (await params).postId;
  const post = await getPost(postId);
  const comments = await getCommentsByPost(postId);
  const currentUser = await getCurrentUser();


  return (
    <>
      <PostCard post={post} currentUser={currentUser}/>
      {comments.map((comment: Comment) => (
        <CommentCard comment={comment} key={comment._id} />
      ))}
    </>
  );
}
