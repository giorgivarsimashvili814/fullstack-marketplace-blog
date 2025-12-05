import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from 'src/comments/schema/comment.schema';
import { Reply } from './schema/reply.schema';
import { cascadeDeleteReplies } from './helpers/reply.helper';
import { Like } from 'src/likes/schema/like.schema';
import { UpdateReplyDto } from './dto/update-reply.dto';

interface CreateReplyParams {
  authorId: string;
  commentId: string;
  content: string;
  replyingTo?: string;
}

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
  ) {}

  async create(params: CreateReplyParams) {
    const { authorId, commentId, content, replyingTo } = params;

    const newReply = await this.replyModel.create({
      author: new Types.ObjectId(authorId),
      comment: new Types.ObjectId(commentId),
      replyingTo: replyingTo ? new Types.ObjectId(replyingTo) : undefined,
      content,
    });

    return { message: 'Reply created successfully!', data: newReply };
  }

  async findByPost(commentId: string) {
    const commentExists = await this.commentModel.exists({
      _id: commentId,
    });

    if (!commentExists) {
      throw new NotFoundException('Comment not found');
    }

    const replies = await this.replyModel
      .find({
        comment: new Types.ObjectId(commentId),
      })
      .populate('author', 'username');

    return { message: 'Replies found', data: replies };
  }

  async update(
    requestingUserId: string,
    replyId: string,
    updateReplyDto: UpdateReplyDto,
  ) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) throw new NotFoundException('Reply not found!');

    if (reply.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to edit this reply!');
    }

    if (!Object.keys(updateReplyDto).length) {
      throw new BadRequestException('No fields provided to update');
    }

    const updatedReply = await this.replyModel.findByIdAndUpdate(
      replyId,
      updateReplyDto,
      { new: true },
    );

    return { message: 'Reply updated successfully!', data: updatedReply };
  }

  async delete(requestingUserId: string, replyId: string) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) throw new NotFoundException('Reply not found!');

    if (reply.author.toString() !== requestingUserId) {
      throw new ForbiddenException('You are not allowed to delete this reply!');
    }

    await cascadeDeleteReplies(this.replyModel, this.likeModel, [reply._id]);

    return { message: 'Reply deleted successfully!', data: reply };
  }
}
