import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Comment, commentSchema } from 'src/comments/schema/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/users/schema/user.schema';
import { Post, postSchema } from 'src/posts/schema/post.schema';
import { Like, likeSchema } from './schema/like.schema';
import { Reply, replySchema } from 'src/replies/schema/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: commentSchema, name: Comment.name },
      { schema: userSchema, name: User.name },
      { schema: postSchema, name: Post.name },
      { schema: likeSchema, name: Like.name },
      { schema: replySchema, name: Reply.name },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
