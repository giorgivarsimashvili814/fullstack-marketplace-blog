import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Post } from 'src/posts/schema/post.schema';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Like } from 'src/likes/schema/like.schema';
import { cascadeDeleteComments } from './helpers/comment.helper';
import { Reply } from 'src/replies/schema/reply.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
  ) {}

  async findAll() {
    const comments = await this.commentModel
      .find()
      .populate('author', 'username')
      .populate('post');

    return { message: 'Comments found!', data: comments };
  }

  async findById(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate('author', 'username')
      .populate('post');

    if (!comment) throw new NotFoundException('Comment not found!');

    return { message: 'Comment found!', data: comment };
  }

  async findByAuthor(authorId: string) {
    const authorExists = await this.userModel.exists({
      _id: new Types.ObjectId(authorId),
    });
    if (!authorExists) throw new NotFoundException('Author not found!');

    const comments = await this.commentModel
      .find({ author: new Types.ObjectId(authorId) })
      .populate('author', 'username');

    return { message: 'Comments found!', data: comments };
  }

  async findByPost(postId: string) {
    const postExists = await this.postModel.exists({
      _id: new Types.ObjectId(postId),
    });
    if (!postExists) throw new NotFoundException('Post not found!');

    const comments = await this.commentModel
      .find({
        post: new Types.ObjectId(postId),
      })
      .populate('author', 'username');

    return { message: 'Comments found!', data: comments };
  }

  async create(
    authorId: string,
    postId: string,
    { content }: CreateCommentDto,
  ) {
    const post = await this.postModel.exists({
      _id: new Types.ObjectId(postId),
    });
    if (!post) throw new NotFoundException('Post not found!');

    const newComment = await this.commentModel.create({
      content,
      post: new Types.ObjectId(postId),
      author: new Types.ObjectId(authorId),
    });

    return { message: 'Comment created successfully!', data: newComment };
  }

  async update(
    requestingUserId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found!');

    if (comment.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to edit this comment!');
    }

    if (!Object.keys(updateCommentDto).length) {
      throw new BadRequestException('No fields provided to update');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(commentId, updateCommentDto, { new: true })
      .populate('post');

    return { message: 'Comment updated successfully!', data: updatedComment };
  }

  async delete(requestingUserId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found!');

    if (comment.author.toString() !== requestingUserId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment!',
      );
    }

    await cascadeDeleteComments(
      this.commentModel,
      this.replyModel,
      this.likeModel,
      [comment._id],
    );

    return { message: 'Comment deleted successfully!', data: comment };
  }
}
