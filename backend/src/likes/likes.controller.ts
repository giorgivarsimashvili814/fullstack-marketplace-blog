import {
  Controller,
  Post,
  UseGuards,
  Param,
  ParseEnumPipe,
  Get,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';

@UseGuards(IsAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':targetType/:targetId')
  toggleLike(
    @UserId() authorId: string,
    @Param('targetType', new ParseEnumPipe(['post', 'comment', 'reply']))
    targetType: 'post' | 'comment' | 'reply',
    @Param('targetId') targetId: string,
  ) {
    return this.likesService.toggleLike(authorId, targetId, targetType);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') targetId: string) {
    return this.likesService.findByPost(targetId);
  }
  @Get('comment/:commentId')
  findByComment(@Param('commentId') targetId: string) {
    return this.likesService.findByComment(targetId);
  }
  @Get('reply/:replyId')
  findByReply(@Param('replyId') targetId: string) {
    return this.likesService.findByReply(targetId);
  }
}
