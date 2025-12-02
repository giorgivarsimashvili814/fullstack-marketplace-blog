import { Model, Types } from 'mongoose';
import { User } from '../schema/user.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';
import { Post } from 'src/posts/schema/post.schema';
import { cascadeDeleteUserComments } from 'src/comments/helpers/comment.helper';
import { cascadeDeleteUserPosts } from 'src/posts/helpers/post.helper';

export async function cascadeDeleteUser(
  userModel: Model<User>,
  postModel: Model<Post>,
  commentModel: Model<Comment>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  await likeModel.deleteMany({ authorId: authorId });

  await cascadeDeleteUserComments(commentModel, likeModel, authorId);

  await cascadeDeleteUserPosts(postModel, commentModel, likeModel, authorId);

  await userModel.findByIdAndDelete(authorId);
}
