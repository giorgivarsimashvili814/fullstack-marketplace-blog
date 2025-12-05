import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { Comment, commentSchema } from 'src/comments/schema/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, replySchema } from './schema/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: replySchema, name: Reply.name },
      { schema: commentSchema, name: Comment.name },
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
