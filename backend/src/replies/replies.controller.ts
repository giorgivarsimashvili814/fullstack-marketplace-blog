import { Controller, Post, Body, Param, Query } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UserId } from 'src/users/decorators/user.decorator';

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post(':commentId')
  create(
    @UserId() authorId: string,
    @Param('commentId') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
    @Query('replyingTo') replyingTo?: string,
  ) {
    return this.repliesService.create({
      authorId,
      commentId: commentId,
      content: createReplyDto.content,
      replyingTo,
    });
  }
}
