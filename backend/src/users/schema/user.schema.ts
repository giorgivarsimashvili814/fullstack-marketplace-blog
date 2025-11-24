import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const userSchema = SchemaFactory.createForClass(User);
