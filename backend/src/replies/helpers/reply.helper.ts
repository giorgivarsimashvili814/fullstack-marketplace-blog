import { Model, Types } from 'mongoose';
import { Reply } from '../schema/reply.schema';
import { Like } from 'src/likes/schema/like.schema';

export async function cascadeDeleteReplies(
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  replyIds: Types.ObjectId[],
) {
  if (!replyIds.length) return;

  await likeModel.deleteMany({ target: { $in: replyIds } });

  await replyModel.deleteMany({ _id: { $in: replyIds } });
}

export async function cascadeDeleteUserReplies(
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  const replyIds: Types.ObjectId[] = await replyModel.distinct('_id', {
    author: authorId,
  });

  await cascadeDeleteReplies(replyModel, likeModel, replyIds);
}

export async function cascadeDeleteCommentReplies(
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  commentId: Types.ObjectId,
) {
  const replyIds: Types.ObjectId[] = await replyModel.distinct('_id', {
    comment: commentId,
  });

  await cascadeDeleteReplies(replyModel, likeModel, replyIds);
}
