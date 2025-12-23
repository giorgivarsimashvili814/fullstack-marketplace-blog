import {
  getCommentsByPost,
  getLikes,
  getRepliesByComment,
} from "@/lib/actions";
import AppLink from "./AppLink";
import LikeButton from "./LikeButton";
import { Comment, Like, Object, Reply, User } from "@/lib/types";

type Props = {
  object: Object;
  currentUser: User;
};

export default async function CardFooter({ object, currentUser }: Props) {
  const type =
    "title" in object ? "post" : "post" in object ? "comment" : "reply";

  const likes = await getLikes(type, object._id);

  let comments: Comment[] = [];
  let replies: Reply[] = [];

  if ("title" in object) {
    comments = await getCommentsByPost(object._id);
  }

  if ("post" in object) {
    replies = await getRepliesByComment(object._id);
  }

  const likedByMe = likes.some(
    (like: Like) => like.author._id === currentUser._id
  );

  return (
    <div className="flex gap-2.5">
      <LikeButton
        initialLiked={likedByMe}
        initialLikes={likes}
        targetId={object._id}
        targetAuthorId={object.author._id}
        targetType={type}
      />
      {"title" in object && (
        <AppLink href={`/posts/${object._id}`}>
          comment {comments.length}
        </AppLink>
      )}

      {"post" in object && (
        <AppLink href={`/comments/${object._id}`}>
          reply {replies.length}
        </AppLink>
      )}
    </div>
  );
}
