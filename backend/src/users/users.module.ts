import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { Post, postSchema } from 'src/posts/schema/post.schema';
import { Comment, commentSchema } from 'src/comments/schema/comment.schema';
import { Like, likeSchema } from 'src/likes/schema/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: userSchema, name: User.name }]),
    MongooseModule.forFeature([{ schema: postSchema, name: Post.name }]),
    MongooseModule.forFeature([{ schema: commentSchema, name: Comment.name }]),
    MongooseModule.forFeature([{ schema: likeSchema, name: Like.name }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
