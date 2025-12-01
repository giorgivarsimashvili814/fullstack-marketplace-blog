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

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
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
      .find({ authorId: new Types.ObjectId(authorId) })
      .populate('author', 'username');

    return { message: 'Posts found!', data: posts };
  }

  async create(authorId: string, { title, content }: CreatePostDto) {
    const newPost = await this.postModel.create({
      authorId: new Types.ObjectId(authorId),
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

    if (post.authorId.toString() !== requestingUserId) {
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

    if (post.authorId.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to delete this post!');
    }

    await this.likeModel.deleteMany({ targetId: post._id });

    const commentIds = await this.commentModel.distinct('_id', {
      postId: post._id,
    });
    await this.likeModel.deleteMany({ targetId: { $in: commentIds } });
    await this.commentModel.deleteMany({ post: post._id });

    const deletedPost = await this.postModel.findByIdAndDelete(post._id);

    return { message: 'Post deleted successfully!', data: deletedPost };
  }
}
