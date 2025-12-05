import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, postSchema } from './schema/post.schema';
import { User, userSchema } from 'src/users/schema/user.schema';
import { Comment, commentSchema } from 'src/comments/schema/comment.schema';
import { Like, likeSchema } from 'src/likes/schema/like.schema';
import { Reply, replySchema } from 'src/replies/schema/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: postSchema, name: Post.name },
      { schema: userSchema, name: User.name },
      { schema: commentSchema, name: Comment.name },
      { schema: likeSchema, name: Like.name },
      { schema: replySchema, name: Reply.name },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
