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
    <div className="flex flex-col">
      <PostCard
        key={post?._id}
        _id={post?._id}
        author={post?.author}
        content={post?.content}
        title={post?.title}
      />
      <CreateCommentForm post={post} />
      <div>
        {comments.map((comment: Comment) => (
          <div key={comment?._id}>{comment?.content}</div>
        ))}
      </div>
    </div>
  );
}
