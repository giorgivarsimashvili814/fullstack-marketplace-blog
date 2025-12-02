import { Model, Types } from 'mongoose';
import { Comment } from '../schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';

export async function cascadeDeleteComments(
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  commentIds: Types.ObjectId[],
) {
  if (!commentIds.length) return;

  await likeModel.deleteMany({ targetId: { $in: commentIds } });

  await commentModel.deleteMany({ _id: { $in: commentIds } });
}

export async function cascadeDeleteUserComments(
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  const commentIds: Types.ObjectId[] = await commentModel.distinct('_id', {
    authorId: authorId,
  });
  console.log(commentIds);
  await cascadeDeleteComments(commentModel, likeModel, commentIds);
}

export async function cascadeDeletePostComments(
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  postId: Types.ObjectId,
) {
  const commentIds: Types.ObjectId[] = await commentModel.distinct('_id', {
    postId: postId,
  });
  await cascadeDeleteComments(commentModel, likeModel, commentIds);
}
