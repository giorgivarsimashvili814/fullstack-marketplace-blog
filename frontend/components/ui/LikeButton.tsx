"use client";
import { useState } from "react";
import Button from "./Button";
import { Like, TargetType } from "@/lib/types";
import { toggleLike } from "@/lib/actions";

type Props = {
  initialLikes: Like[];
  targetId: string;
  initialLiked: boolean;
  targetAuthorId: string;
  targetType: TargetType;
};

export default function LikeButton({
  initialLiked,
  initialLikes,
  targetId,
  targetAuthorId,
  targetType,
}: Props) {
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [liked, setLiked] = useState(initialLiked);

  const handleClick = async () => {
    setLiked(!liked);
    setLikesCount(likesCount + (liked ? -1 : 1));

    await toggleLike(targetType, targetAuthorId, targetId);
  };

  return (
    <Button onClick={handleClick}>
      {liked ? "Unlike" : "Like"} {likesCount}
    </Button>
  );
}
