import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, postSchema } from './schema/post.schema';
import { User, userSchema } from 'src/users/schema/user.schema';
import { commentSchema } from 'src/comments/schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: postSchema, name: Post.name },
      { schema: userSchema, name: User.name },
      { schema: commentSchema, name: Comment.name },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
