import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: Types.ObjectId;
}

export const postSchema = SchemaFactory.createForClass(Post);
