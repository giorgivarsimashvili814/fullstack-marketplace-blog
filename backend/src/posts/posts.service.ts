import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Post } from './schema/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { Comment } from 'src/comments/schema/comment.schema';
import { Like } from 'src/likes/schema/like.schema';
import { cascadeDeletePosts } from './helpers/post.helper';
import { Reply } from 'src/replies/schema/reply.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
  ) {}

  async findAll() {
    const posts = await this.postModel.find().populate('author', 'username');

    return { message: 'Posts found!', data: posts };
  }

  async findById(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('author', 'username');

    if (!post) throw new NotFoundException('Post not found!');

    return { message: 'Post found!', data: post };
  }

  async findByAuthor(authorId: string) {
    const authorExists = await this.userModel.exists({ _id: authorId });

    if (!authorExists) throw new NotFoundException('Author not found!');

    const posts = await this.postModel
      .find({ author: new Types.ObjectId(authorId) })
      .populate('author', 'username');

    return { message: 'Posts found!', data: posts };
  }

  async create(authorId: string, { title, content }: CreatePostDto) {
    const newPost = await this.postModel.create({
      author: new Types.ObjectId(authorId),
      title,
      content,
    });

    return { message: 'Post created successfully!', data: newPost };
  }

  async update(
    requestingUserId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found!');

    if (post.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to edit this post!');
    }

    if (!Object.keys(updatePostDto).length) {
      throw new BadRequestException('No fields provided to update');
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      updatePostDto,
      { new: true },
    );

    return { message: 'Post updated successfully!', data: updatedPost };
  }

  async delete(requestingUserId: string, postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found!');

    if (post.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to delete this post!');
    }

    await cascadeDeletePosts(
      this.postModel,
      this.commentModel,
      this.replyModel,
      this.likeModel,
      [post._id],
    );

    return { message: 'Post deleted successfully!', data: post };
  }
}
