"use client";
import { Like, Object } from "@/lib/types";
import Button from "../ui/Button";
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

  return <Button onClick={handleClick}>{isLiked ? 'Unlike' : 'Like'} {likes.length}</Button>;
}
