import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    lowercase: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  posts: Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
