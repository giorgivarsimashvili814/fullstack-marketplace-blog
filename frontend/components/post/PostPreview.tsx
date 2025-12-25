import { Comment, Like, Post, User } from "@/lib/types";
import LikeButton from "./Like";
import Button from "../ui/Button";

type Props = {
  post: Post;
  likes: Like[];
  currentUser: User;
  comments: Comment[];
};

export default function PostPreview({
  post,
  likes,
  currentUser,
  comments,
}: Props) {
  return (
    <div
      className="w-full max-w-125 rounded-lg p-2 flex flex-col gap-2.5 bg-white shadow"
      onClick={(e) => e.stopPropagation()}
    >
      {/* card header */}
      <div className="flex gap-2.5 items-center">
        <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
          {post.author.username[0].toUpperCase()}
        </div>
        <h2>{post.author.username}</h2>
      </div>
      {/* card main */}
      <article className="flex flex-col justify-between cursor-pointer gap-2.5">
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
        <Button>Comment {comments.length}</Button>
      </div>
    </div>
  );
}
