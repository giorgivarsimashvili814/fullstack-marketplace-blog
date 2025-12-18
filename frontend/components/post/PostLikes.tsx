"use client";
import { useState } from "react";
import { getLikesByPost, toggleLike } from "@/lib/actions";
import { Like } from "@/lib/types";
import Button from "../ui/Button";

interface PostLikesProps {
  postId: string;
  initialLikes: Like[];
}

export default function PostLikes({ postId, initialLikes }: PostLikesProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      await toggleLike(postId, "post");

      const updatedLikes = await getLikesByPost(postId);
      setLikes(updatedLikes);
    } catch (err) {
      console.error("Failed to like post:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Button onClick={handleLikeClick} disabled={isLiking}>
      {likes.length} Likes
    </Button>
  );
}
