/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({ username, email, password }: SignUpDto) {
    const user = await this.userModel.findOne({ email });

    if (user) throw new BadRequestException('email in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return { message: 'user created successfully', data: newUser };
  }

  async signIn({ email, password }: SignInDto, res: Response) {
    const user = await this.userModel.findOne({ email }).select('password');
    if (!user) throw new BadRequestException('invalid credentials');

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) throw new BadRequestException('invalid credentials');

    const payload = { id: user._id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });

    return {
      success: true,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
