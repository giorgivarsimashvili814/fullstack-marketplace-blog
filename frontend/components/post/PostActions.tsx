import React from 'react'
import LikeButton from './Like'
import CommentButton from './Comment'

export default function PostActions() {
  return (
    <div>
      <LikeButton likes={likes} currentUserId={} object={}/>
      <CommentButton/>
    </div>
  )
}
