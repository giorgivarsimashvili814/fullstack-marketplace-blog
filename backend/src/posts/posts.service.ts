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
import { Comment } from 'src/comments/schema/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
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
      .populate('author', '_id username')
      .populate({
        path: 'comments',
        select: '_id content author createdAt',
        populate: { path: 'author', select: '_id username' },
      });

    if (!post) throw new NotFoundException('Post not found!');

    return { message: 'Post found!', data: post };
  }

  async findByAuthor(authorId: string) {
    const authorExists = await this.userModel.exists({ _id: authorId });

    if (!authorExists) throw new NotFoundException('Author not found!');

    const posts = await this.postModel
      .find({ author: authorId })
      .populate('author', '_id username');

    return { message: 'Posts found!', data: posts };
  }

  async create(authorId: string, { title, content }: CreatePostDto) {
    const authorExists = await this.userModel.exists({ _id: authorId });
    if (!authorExists) throw new NotFoundException('Author not found!');

    const newPost = await this.postModel.create({
      title,
      content,
      author: authorId,
    });

    await this.userModel.findByIdAndUpdate(authorId, {
      $push: { posts: newPost._id },
    });

    return { message: 'Post created successfully!', data: newPost };
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

    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { title, content },
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

    await this.commentModel.deleteMany({ post: postId });

    await this.userModel.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id },
    });

    const deletedPost = await this.postModel.findByIdAndDelete(postId);

    return { message: 'Post deleted successfully!', data: deletedPost };
  }

  async toggleLike(userId: string, postId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const liked = await this.postModel.exists({
      _id: postId,
      likes: userObjectId,
    });

    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      liked
        ? { $pull: { likes: userObjectId } }
        : { $addToSet: { likes: userObjectId } },
      { new: true },
    );

    if (!updatedPost) throw new NotFoundException('Post not found');

    return {
      message: liked ? 'Post unliked successfully' : 'Post liked successfully',
      data: {
        ...updatedPost.toObject(),
        likesCount: updatedPost.likes.length,
        isLiked: !liked,
      },
    };
  }
}
