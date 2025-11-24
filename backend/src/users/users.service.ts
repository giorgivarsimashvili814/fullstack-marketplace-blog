import {
  BadRequestException,
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

  findAll() {
    return this.userModel.find();
  }

  async findById(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException(`user with ID: ${userId} not found`);

    return { message: 'user found', data: user };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new BadRequestException('user not found');

    return { message: 'user updated successfully', data: updatedUser };
  }

  async delete(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    if (!deletedUser) throw new BadRequestException('user not found');

    return { message: 'user deleted successfully', data: deletedUser };
  }
}
