import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Post } from 'src/posts/schema/post.schema';
import { Comment } from 'src/comments/schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';
import { cascadeDeleteUser } from './helpers/user.helper';

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

  async update(requestingUserId: string, updateUserDto: UpdateUserDto) {
    if (!Object.keys(updateUserDto).length) {
      throw new BadRequestException('No fields provided to update!');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      requestingUserId,
      updateUserDto,
      { new: true },
    );

    return { message: 'User updated successfully!', data: updatedUser };
  }

  async delete(requestingUserId: string) {
    const deletedUser = await cascadeDeleteUser(
      this.userModel,
      this.postModel,
      this.commentModel,
      this.likeModel,
      new Types.ObjectId(requestingUserId),
    );

    return { message: 'User deleted successfully!', data: deletedUser };
  }
}
