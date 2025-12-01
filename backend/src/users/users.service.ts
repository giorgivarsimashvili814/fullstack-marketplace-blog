import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Post } from 'src/posts/schema/post.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
  ) {}

  async findAll() {
    const users = await this.userModel.find({}, { email: 0 });

    return { message: 'Users found!', data: users };
  }

  async findById(requestingUserId: string, targetUserId: string) {
    if (requestingUserId === targetUserId) {
      const user = await this.userModel.findById(targetUserId);

      if (!user) throw new NotFoundException('User not found!');

      return { message: 'User found!', data: user };
    }

    const user = await this.userModel.findById(targetUserId, {
      email: 0,
    });

    if (!user) throw new NotFoundException('User not found!');

    return { message: 'User found!', data: user };
  }

  async update(
    requestingUserId: string,
    targetUserId: string,
    updateUserDto: UpdateUserDto,
  ) {
    if (requestingUserId !== targetUserId) {
      throw new ForbiddenException('You are not allowed to edit this user!');
    }

    if (!Object.keys(updateUserDto).length) {
      throw new BadRequestException('No fields provided to update!');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      targetUserId,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('User not found!');

    return { message: 'User updated successfully!', data: updatedUser };
  }

  async delete(requestingUserId: string, targetUserId: string) {
    const user = await this.userModel.findById(targetUserId);
    if (!user) throw new NotFoundException('User not found!');

    if (requestingUserId !== targetUserId) {
      throw new ForbiddenException('You are not allowed to delete this user!');
    }

    //user posts
    const userPostIds = await this.postModel.distinct('_id', {
      authorId: user._id,
    });

    //users posts likes
    await this.likeModel.deleteMany({ targetId: { $in: userPostIds } });

    //users posts comments
    const userPostCommentIds = await this.commentModel.distinct('_id', {
      postId: { $in: userPostIds },
    });

    //users posts comments likes
    await this.likeModel.deleteMany({ targetId: { $in: userPostCommentIds } });

    //user comments
    const userCommentIds = await this.commentModel.distinct('_id', {
      authorId: user._id,
    });

    //user comment likes
    await this.likeModel.deleteMany({ targetId: { $in: userCommentIds } });

    await this.postModel.deleteMany({ _id: { $in: userPostIds } });
    await this.commentModel.deleteMany({ _id: { $in: userPostCommentIds } });
    await this.commentModel.deleteMany({ _id: { $in: userCommentIds } });
    // user likes
    await this.likeModel.deleteMany({
      authorId: user._id,
    });

    //delete a user
    const deletedUser = await this.userModel.findByIdAndDelete(targetUserId);

    if (!deletedUser) throw new NotFoundException('User not found!');

    return { message: 'User deleted successfully!', data: deletedUser };
  }
}
