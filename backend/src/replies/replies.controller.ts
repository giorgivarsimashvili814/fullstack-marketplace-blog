import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UserId } from 'src/users/decorators/user.decorator';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UpdateReplyDto } from './dto/update-reply.dto';

@UseGuards(IsAuthGuard)
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

  @Delete(':replyId')
  update(
    @UserId() requsetingUserId: string,
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: UpdateReplyDto,
  ) {
    return this.repliesService.update(
      requsetingUserId,
      replyId,
      updateReplyDto,
    );
  }

  @Delete(':replyId')
  delete(
    @UserId() requestingUserId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.repliesService.delete(requestingUserId, replyId);
  }
}
