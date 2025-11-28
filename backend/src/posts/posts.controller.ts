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

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByAuthor(userId);
  }

  @Get(':id')
  findById(@Param('id') postId: string) {
    return this.postsService.findById(postId);
  }

  @Post()
  create(@UserId() authorId: string, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(authorId, createPostDto);
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
