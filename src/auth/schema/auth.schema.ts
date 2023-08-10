import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ required: true })
  isvalid: boolean;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: Date.now(),
  })
  updatedAt: Date;

  @Prop({ type: Number, select: false })
  __v: number;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
