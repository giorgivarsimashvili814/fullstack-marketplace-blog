import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from 'src/comments/schema/comment.schema';
import { Reply } from './schema/reply.schema';

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
  ) {}

  async create(params: CreateReplyParams) {
    const { authorId, commentId, content, replyingTo } = params;

    const newReply = await this.replyModel.create({
      author: new Types.ObjectId(authorId),
      parent: new Types.ObjectId(commentId),
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
        parent: new Types.ObjectId(commentId),
      })
      .populate('author', 'username');

    return { message: 'Replies found', data: replies };
  }
}
