import { Model, Types } from 'mongoose';
import { Post } from '../schema/post.schema';
import { Like } from 'src/likes/schema/like.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { cascadeDeletePostComments } from 'src/comments/helpers/comment.helper';

export async function cascadeDeletePosts(
  postModel: Model<Post>,
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  postIds: Types.ObjectId[],
) {
  if (!postIds.length) return;

  await likeModel.deleteMany({ targetId: { $in: postIds } });

  for (const postId of postIds) {
    await cascadeDeletePostComments(commentModel, likeModel, postId);
  }

  await postModel.deleteMany({ _id: { $in: postIds } });
}

export async function cascadeDeleteUserPosts(
  postModel: Model<Post>,
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  const postIds: Types.ObjectId[] = await postModel.distinct('_id', {
    authorId: authorId,
  });

  await cascadeDeletePosts(postModel, commentModel, likeModel, postIds);
}
