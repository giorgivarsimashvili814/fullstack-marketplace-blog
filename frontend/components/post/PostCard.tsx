import { Post, User } from "@/lib/types";
import LikeButton from "../ui/Like";
import { getCommentsByPost, getLikes } from "@/lib/actions";
import AppLink from "../ui/AppLink";
import ClientPost from "./ClientPost";

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
      <ClientPost post={post} />
      {/* card footer */}
      <div className="flex gap-1.5">
        <LikeButton
          currentUserId={currentUser._id}
          likes={likes}
          object={post}
        />
        <AppLink className="flex gap-1.5 items-center" href={`/posts/${post._id}`}>
          <svg
            aria-hidden="true"
            className="icon-comment"
            fill="black"
            height="20"
            width="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L0.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z" />
          </svg>

          {comments.length}
        </AppLink>
      </div>
    </div>
  );
}
