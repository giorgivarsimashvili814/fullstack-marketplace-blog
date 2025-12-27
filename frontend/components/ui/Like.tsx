"use client";
import { Like, Object } from "@/lib/types";
import Button from "./Button";
import { toggleLike } from "@/lib/actions";
import { useState } from "react";

type Props = {
  likes: Like[];
  object: Object;
  currentUserId: string;
};

export default function LikeButton({ likes, object, currentUserId }: Props) {
  const isLiked = likes.some((like) => like.author._id === currentUserId);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [liked, setLiked] = useState(isLiked);

  const type =
    "title" in object ? "post" : "post" in object ? "comment" : "reply";

  async function handleClick() {
    try {
      await toggleLike(type, object._id);
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? -1 : 1));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  }

  return (
    <Button className="flex gap-1.5 items-center" onClick={handleClick}>
      {liked ? (
        <svg
          aria-hidden="true"
          fill="black"
          height="20"
          width="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="20"
          width="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z" />
        </svg>
      )}
      {likeCount}
    </Button>
  );
}
