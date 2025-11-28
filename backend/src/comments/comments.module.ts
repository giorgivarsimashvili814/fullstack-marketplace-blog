import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/users/schema/user.schema';
import { Post, postSchema } from 'src/posts/schema/post.schema';
import { Comment, commentSchema } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: commentSchema, name: Comment.name },
      { schema: userSchema, name: User.name },
      { schema: postSchema, name: Post.name },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
