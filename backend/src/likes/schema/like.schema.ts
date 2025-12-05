import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Like {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  target: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['post', 'comment', 'reply'],
  })
  targetType: 'post' | 'comment' | 'reply';
}

export const likeSchema = SchemaFactory.createForClass(Like);
