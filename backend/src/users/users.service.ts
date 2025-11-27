import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll() {
    const users = await this.userModel.find({}, '_id username');

    return { message: 'Users found!', data: users };
  }

  async findById(requestingUserId: string, targetUserId: string) {
    const user = await this.userModel.findById(targetUserId, {
      email: requestingUserId !== targetUserId ? 0 : 1,
      posts: 1,
      createdAt: 1,
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

    const updatedUser = await this.userModel.findByIdAndUpdate(
      targetUserId,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('User not found!');

    return { message: 'User updated successfully!', data: updatedUser };
  }

  async delete(requestingUserId: string, targetUserId: string) {
    if (requestingUserId !== targetUserId) {
      throw new ForbiddenException('You are not allowed to delete this user!');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(targetUserId);

    if (!deletedUser) throw new NotFoundException('User not found!');

    return { message: 'User deleted successfully!', data: deletedUser };
  }
}
