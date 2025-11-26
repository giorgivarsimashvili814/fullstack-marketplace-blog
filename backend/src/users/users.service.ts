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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async create({ username, email }: CreateUserDto) {
    const user = await this.userModel.findOne({ email });

    if (user) throw new BadRequestException('email in use');

    const newUser = await this.userModel.create({
      username,
      email,
    });

    return { message: 'user created successfully', data: newUser };
  }

  async findAll() {
    const users = await this.userModel.find().lean();

    const result = users.map(({ email, ...rest }) => rest);

    return { message: 'Users found', data: result };
  }

  async findById(requestingUserId: string, targetUserId: string) {
    const isSelf = requestingUserId === targetUserId;

    const user = await this.userModel.findById(targetUserId).lean();

    if (!user) throw new NotFoundException('User not found');

    if (!isSelf) {
      const { email, password, ...publicFields } = user;
      return { message: 'User found', data: publicFields };
    }

    return { message: 'User found', data: user };
  }

  async update(
    requestingUserId: string,
    targetUserId: string,
    updateUserDto: UpdateUserDto,
  ) {
    const isSelf = requestingUserId === targetUserId;

    if (!isSelf) {
      throw new ForbiddenException(
        'Updating other users’ profiles is not permitted.',
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
        'Updating other users’ profiles is not permitted.',
      );
    }

    const deletedUser = await this.userModel.findByIdAndDelete(targetUserId);

    if (!deletedUser) throw new BadRequestException('user not found');

    return { message: 'user deleted successfully', data: deletedUser };
  }
}
