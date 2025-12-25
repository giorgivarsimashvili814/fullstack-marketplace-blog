import { Post, User } from "@/lib/types";
import LikeButton from "./Like";
import CommentButton from "./Comment";
import { getCommentsByPost, getLikes } from "@/lib/actions";

type Props = {
  post: Post;
  currentUser: User;
};

export default async function PostCard({ post, currentUser }: Props) {
  const [likes, comments] = await Promise.all([
    getLikes("post", post._id),
    getCommentsByPost(post._id),
  ]);

  return (
    <div className="w-full max-w-125 rounded-lg p-2 flex flex-col gap-2.5 bg-white shadow">
      {/* card header */}
      <div className="flex gap-2.5 items-center">
        <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
          {post.author.username[0].toUpperCase()}
        </div>
        <h2>{post.author.username}</h2>
      </div>
      {/* card main */}
      <article className="flex flex-col justify-between gap-2.5">
        <h3 className="text-2xl overflow-wrap wrap-break-word">{post.title}</h3>
        <p className="overflow-wrap wrap-break-word">{post.content}</p>
      </article>
      {/* card footer */}
      <div className="grid grid-cols-2">
        <LikeButton
          currentUserId={currentUser._id}
          likes={likes}
          object={post}
        />
        <CommentButton
          comments={comments}
          post={post}
          currentUser={currentUser}
          likes={likes}
        />
      </div>
    </div>
  );
}
