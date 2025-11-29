import {
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

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async findAll() {
    const comments = await this.commentModel
      .find()
      .populate('author', '_id username');

    return { message: 'Comments found!', data: comments };
  }

  async findById(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate('author', '_id username');

    if (!comment) throw new NotFoundException('Comment not found!');

    return { message: 'Comment found!', data: comment };
  }

  async findByAuthor(authorId: string) {
    const authorExists = await this.userModel.exists({ _id: authorId });
    if (!authorExists) throw new NotFoundException('Author not found!');

    const comments = await this.commentModel
      .find({ author: authorId })
      .populate('author', '_id username');

    return { message: 'Comments found!', data: comments };
  }

  async create(
    authorId: string,
    postId: string,
    { content }: CreateCommentDto,
  ) {
    const authorExists = await this.userModel.exists({ _id: authorId });
    if (!authorExists) throw new NotFoundException('Author not found!');

    const newComment = await this.commentModel.create({
      content,
      post: postId,
      author: authorId,
    });

    await this.postModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    return { message: 'Comment created successfully', data: newComment };
  }

  async update(
    requestingUserId: string,
    commentId: string,
    { content }: UpdateCommentDto,
  ) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found!');

    if (comment.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to edit this comment!');
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      { content },
      { new: true },
    );

    return { message: 'Comment updated successfully', data: updatedComment };
  }

  async delete(requestingUserId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found!');

    if (comment.author.toString() !== requestingUserId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment!',
      );
    }

    await this.postModel.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    const deletedComment = await this.commentModel.findByIdAndDelete(commentId);

    return { message: 'Comment deleted successfully!', data: deletedComment };
  }

  async toggleLike(userId: string, commentId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const liked = await this.commentModel.exists({
      _id: commentId,
      likes: userObjectId,
    });

    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      liked
        ? { $pull: { likes: userObjectId } }
        : { $addToSet: { likes: userObjectId } },
      { new: true },
    );

    if (!updatedComment) throw new NotFoundException('Comment not found');

    return {
      message: liked
        ? 'Comment unliked successfully'
        : 'Comment liked successfully',
      data: {
        ...updatedComment.toObject(),
        likesCount: updatedComment.likes.length,
        isLiked: !liked,
      },
    };
  }
}
