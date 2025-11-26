/* eslint-disable @typescript-eslint/no-unused-vars */
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

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async findAll() {
    const users = await this.userModel.find().lean();

    const result = users.map(({ email, ...rest }) => rest);

    return { message: 'users found', data: result };
  }

  async findById(requestingUserId: string, targetUserId: string) {
    const isSelf = requestingUserId === targetUserId;

    const user = await this.userModel.findById(targetUserId).lean();

    if (!user) throw new NotFoundException('user not found');

    if (!isSelf) {
      const { email, ...rest } = user;
      return { message: 'user found', data: rest };
    }

    return { message: 'user found', data: user };
  }

  async update(
    requestingUserId: string,
    targetUserId: string,
    updateUserDto: UpdateUserDto,
  ) {
    const isSelf = requestingUserId === targetUserId;

    if (!isSelf) {
      throw new ForbiddenException(
        'updating other users’ profiles is not permitted.',
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      targetUserId,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new BadRequestException('user not found');

    return { message: 'user updated successfully', data: updatedUser };
  }

  async delete(requestingUserId: string, targetUserId: string) {
    const isSelf = requestingUserId === targetUserId;

    if (!isSelf) {
      throw new ForbiddenException(
        'deleting other users’ profiles is not permitted.',
      );
    }

    const deletedUser = await this.userModel.findByIdAndDelete(targetUserId);

    if (!deletedUser) throw new BadRequestException('user not found');

    return { message: 'user deleted successfully', data: deletedUser };
  }
}
