import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model, Types } from 'mongoose';
import { Like } from './schema/like.schema';
import { Post } from 'src/posts/schema/post.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { Reply } from 'src/replies/schema/reply.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
  ) {}

  async toggleLike(
    authorId: string,
    targetId: string,
    targetType: 'post' | 'comment' | 'reply',
  ) {
    const authorObjectId = new Types.ObjectId(authorId);
    const targetObjectId = new Types.ObjectId(targetId);

    const modelMap = {
      post: this.postModel,
      comment: this.commentModel,
      reply: this.replyModel,
    } as const;

    const target = modelMap[targetType];
    if (!target) throw new BadRequestException('Invalid targetType');

    const targetExists = await target.exists({ _id: targetObjectId });
    if (!targetExists) throw new NotFoundException(`${targetType} not found!`);

    const existingLike = await this.likeModel.findOneAndDelete({
      author: authorObjectId,
      target: targetObjectId,
      targetType,
    });

    if (existingLike) {
      return { message: 'Unliked successfully!', data: existingLike };
    }

    const newLike = await this.likeModel.findOneAndUpdate(
      {
        author: authorObjectId,
        target: targetObjectId,
        targetType,
      },
      {
        author: authorObjectId,
        target: targetObjectId,
        targetType,
      },
      { upsert: true, new: true },
    );

    return { message: 'Liked successfully!', data: newLike };
  }

  async findByPost(postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found!');

    const likes = await this.likeModel
      .find({
        target: new Types.ObjectId(postId),
      })
      .populate('author', 'username');

    return { message: 'Likes found!', data: likes };
  }

  async findByComment(commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found!');

    const likes = await this.likeModel
      .find({
        target: new Types.ObjectId(commentId),
      })
      .populate('author', 'username');

    return { message: 'Likes found!', data: likes };
  }

  async findByReply(replyId: string) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) throw new NotFoundException('Reply not found!');

    const likes = await this.likeModel
      .find({
        target: new Types.ObjectId(replyId),
      })
      .populate('author', 'username');

    return { message: 'Likes found!', data: likes };
  }
}
