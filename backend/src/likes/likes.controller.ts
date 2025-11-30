import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseEnumPipe,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';

@UseGuards(IsAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':targetType/:targetId')
  async like(
    @UserId() authorId: string,
    @Param('targetId') targetId: string,
    @Param('targetType', new ParseEnumPipe(['post', 'comment']))
    targetType: 'post' | 'comment',
  ) {
    return this.likesService.create(authorId, targetId, targetType);
  }

  @Delete(':targetType/:targetId')
  async unlike(
    @UserId() authorId: string,
    @Param('targetId') targetId: string,
    @Param('targetType', new ParseEnumPipe(['post', 'comment']))
    targetType: 'post' | 'comment',
  ) {
    return this.likesService.delete(authorId, targetId, targetType);
  }
}
