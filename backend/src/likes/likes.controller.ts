import {
  Controller,
  Post,
  UseGuards,
  Param,
  ParseEnumPipe,
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
}
