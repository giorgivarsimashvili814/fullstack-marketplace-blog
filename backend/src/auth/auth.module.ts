/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ schema: userSchema, name: 'user' }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
