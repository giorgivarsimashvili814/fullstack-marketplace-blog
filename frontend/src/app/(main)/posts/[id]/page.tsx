import { axiosInstance } from "@/lib/axios-instance";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;

  const res = await axiosInstance.get(`/posts/${postId}`);
  const post = res.data.data;

  return (
    <div>
      <h1>Post Details for ID: {post._id}</h1>
      <h1>author: {post.author.username}</h1>
    </div>
  );
}
