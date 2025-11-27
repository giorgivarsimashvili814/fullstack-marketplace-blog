import {
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

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async findAll() {
    const posts = await this.postModel
      .find()
      .populate('author', '_id username');

    return { message: 'Posts found!', data: posts };
  }

  async findById(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('author', '_id username');

    if (!post) throw new NotFoundException('Post not found!');

    return { message: 'Post found!', data: post };
  }

  async findByAuthor(userId: string) {
    const authorObjectId = new Types.ObjectId(userId);

    const posts = await this.postModel
      .find({ author: authorObjectId })
      .populate('author', '_id username');

    return { message: 'Posts found!', data: posts };
  }

  async create(authorId: string, { title, content }: CreatePostDto) {
    const author = await this.userModel.findById(authorId);
    if (!author) throw new NotFoundException('Author not found!');

    const newPost = await this.postModel.create({
      title,
      content,
      author: author._id,
    });

    await this.userModel.findByIdAndUpdate(author._id, {
      $push: { posts: newPost._id },
    });

    const populatedPost = await newPost.populate('author', '_id username');

    return { message: 'Post created successfully!', data: populatedPost };
  }

  async update(
    requestingUserId: string,
    postId: string,
    { title, content }: UpdatePostDto,
  ) {
    const post = await this.postModel.findById(postId);

    if (!post) throw new NotFoundException('Post not found!');

    if (post.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to edit this post!');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          title,
          content,
        },
        { new: true },
      )
      .populate('author', '_id username');

    return { message: 'Post updated successfully!', data: updatedPost };
  }

  async delete(requestingUserId: string, postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found!');

    if (post.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to delete this post!');
    }

    await this.userModel.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id },
    });

    const deletedPost = await this.postModel
      .findByIdAndDelete(postId)
      .populate('author', '_id username');

    return { message: 'Post deleted successfully!', data: deletedPost };
  }
}
