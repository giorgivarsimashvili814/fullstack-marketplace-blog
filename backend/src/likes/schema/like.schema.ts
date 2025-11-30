import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Like {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  targetId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['post', 'comment'],
  })
  targetType: 'post' | 'comment';
}

export const likeSchema = SchemaFactory.createForClass(Like);
