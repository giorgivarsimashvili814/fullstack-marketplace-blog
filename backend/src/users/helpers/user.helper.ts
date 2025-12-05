import { Model, Types } from 'mongoose';
import { User } from '../schema/user.schema';
import { Post } from 'src/posts/schema/post.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { Reply } from 'src/replies/schema/reply.schema';
import { Like } from 'src/likes/schema/like.schema';
import { cascadeDeleteUserReplies } from 'src/replies/helpers/reply.helper';
import { cascadeDeleteUserComments } from 'src/comments/helpers/comment.helper';
import { cascadeDeleteUserPosts } from 'src/posts/helpers/post.helper';

export async function cascadeDeleteUser(
  userModel: Model<User>,
  postModel: Model<Post>,
  commentModel: Model<Comment>,
  replyModel: Model<Reply>,
  likeModel: Model<Like>,
  authorId: Types.ObjectId,
) {
  await likeModel.deleteMany({ author: authorId });

  await cascadeDeleteUserReplies(replyModel, likeModel, authorId);

  await cascadeDeleteUserComments(
    commentModel,
    replyModel,
    likeModel,
    authorId,
  );

  await cascadeDeleteUserPosts(
    postModel,
    commentModel,
    replyModel,
    likeModel,
    authorId,
  );

  await userModel.findByIdAndDelete(authorId);
}
