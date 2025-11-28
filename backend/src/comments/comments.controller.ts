import {
  Controller,
  Body,
  UseGuards,
  Post,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(IsAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.commentsService.findByAuthor(userId);
  }

  @Get(':id')
  findById(@Param('id') commentId: string) {
    return this.commentsService.findById(commentId);
  }

  @Post('post/:postId')
  create(
    @UserId() authorId: string,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(authorId, postId, createCommentDto);
  }

  @Patch(':id')
  update(
    @UserId() requestingUserId: string,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      requestingUserId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  delete(@UserId() requestingUserId: string, @Param('id') commentId: string) {
    return this.commentsService.delete(requestingUserId, commentId);
  }
}
