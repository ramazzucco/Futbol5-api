import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Booking',
    required: false,
  })
  bookings: ObjectId[];

  @Prop({ type: String, select: false })
  token: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
