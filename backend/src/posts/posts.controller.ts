import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(IsAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@UserId() authorId: string, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(authorId, createPostDto);
  }

  @Get('author/:userId')
  findByAuthor(@Param('userId') authorId: string) {
    return this.postsService.findByAuthor(authorId);
  }

  @Post(':id/toggle-like')
  toggleLike(@UserId() userId: string, @Param('id') postId: string) {
    return this.postsService.toggleLike(userId, postId);
  }

  @Get(':id')
  findById(@Param('id') postId: string) {
    return this.postsService.findById(postId);
  }

  @Patch(':id')
  update(
    @UserId() requestingUserId: string,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(requestingUserId, postId, updatePostDto);
  }

  @Delete(':id')
  delete(@UserId() requestingUserId: string, @Param('id') postId: string) {
    return this.postsService.delete(requestingUserId, postId);
  }
}
