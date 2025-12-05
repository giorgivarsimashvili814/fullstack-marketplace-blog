import { Model, Types } from 'mongoose';
import { Comment } from '../schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';
import { cascadeDeleteCommentReplies } from 'src/replies/helpers/reply.helper';
import { Reply } from 'src/replies/schema/reply.schema';

export async function cascadeDeleteComments(
  commentModel: Model<Comment>,
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  commentIds: Types.ObjectId[],
) {
  if (!commentIds.length) return;

  await likeModel.deleteMany({ target: { $in: commentIds } });

  for (const commentId of commentIds) {
    await cascadeDeleteCommentReplies(replyModel, likeModel, commentId);
  }

  await commentModel.deleteMany({ _id: { $in: commentIds } });
}

export async function cascadeDeleteUserComments(
  commentModel: Model<Comment>,
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  const commentIds: Types.ObjectId[] = await commentModel.distinct('_id', {
    author: authorId,
  });

  await cascadeDeleteComments(commentModel, replyModel, likeModel, commentIds);
}

export async function cascadeDeletePostComments(
  commentModel: Model<Comment>,
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  postId: Types.ObjectId,
) {
  const commentIds: Types.ObjectId[] = await commentModel.distinct('_id', {
    post: postId,
  });

  await cascadeDeleteComments(commentModel, replyModel, likeModel, commentIds);
}
