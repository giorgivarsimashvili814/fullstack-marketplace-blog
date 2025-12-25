"use client";
import { Comment, Like, Post, User } from "@/lib/types";
import Button from "../ui/Button";
import { useState } from "react";
import { createComment } from "@/lib/actions";
import Textarea from "../ui/Textarea";
import CommentCard from "../comment/CommentCard";
import PostPreview from "./PostPreview";
import { useRouter } from "next/navigation";

type Props = {
  post: Post;
  comments: Comment[];
  currentUser: User;
  likes: Like[];
};
export default function CommentButton({
  post,
  comments,
  currentUser,
  likes,
}: Props) {
  const [isShown, setIsShown] = useState(false);
  const router = useRouter();

  function openModal() {
    setIsShown(true);
  }

  function closeModal() {
    router.refresh()
    setIsShown(false)
  }

  return (
    <div>
      <Button onClick={openModal} className="w-full">
        Comment {comments.length}
      </Button>

      {isShown && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="flex flex-col gap-5 bg-white h-[calc(100vh-200px)] overflow-y-scroll rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <PostPreview
              comments={comments}
              currentUser={currentUser}
              likes={likes}
              post={post}
            />
            <div className="w-full max-w-2xl flex flex-col gap-5">
              {comments.map((comment: Comment) => (
                <CommentCard key={comment._id} comment={comment} />
              ))}
            </div>
            <form
              action={createComment.bind(null, post._id)}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col bottom-0 sticky bg-white p-2"
            >
              <Textarea
                rows={2}
                id="content"
                name="content"
                maxLength={120}
                required
              />
              <Button type="submit">Add</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
