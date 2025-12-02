import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model, Types } from 'mongoose';
import { Like } from './schema/like.schema';
import { Post } from 'src/posts/schema/post.schema';
import { Comment } from 'src/comments/schema/comment.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(authorId: string, targetId: string, targetType: string) {
    const author = await this.userModel.findById(authorId);
    if (!author) throw new NotFoundException('Author not found!');

    const authorObjectId = new Types.ObjectId(authorId);
    const targetObjectId = new Types.ObjectId(targetId);

    const isLiked = await this.likeModel.findOne({
      authorId: authorObjectId,
      targetId: targetObjectId,
      targetType,
    });
    if (isLiked) throw new ConflictException('Already liked!');

    const target = targetType === 'post' ? this.postModel : this.commentModel;
    const targetExists = await target.exists({ _id: targetObjectId });
    if (!targetExists) throw new NotFoundException(`${targetType} not found!`);

    const newLike = await this.likeModel.findOneAndUpdate(
      {
        authorId: authorObjectId,
        targetId: targetObjectId,
        targetType,
      },
      {
        authorId: authorObjectId,
        targetId: targetObjectId,
        targetType,
      },
      { upsert: true, new: true },
    );

    return { message: 'Liked successfully!', data: newLike };
  }

  async delete(authorId: string, targetId: string, targetType: string) {
    const authorObjectId = new Types.ObjectId(authorId);
    const targetObjectId = new Types.ObjectId(targetId);

    const removedLike = await this.likeModel.findOneAndDelete({
      authorId: authorObjectId,
      targetId: targetObjectId,
      targetType,
    });

    if (!removedLike) throw new NotFoundException('Like not found!');

    return { message: 'Unliked successfully!', data: removedLike };
  }
}
