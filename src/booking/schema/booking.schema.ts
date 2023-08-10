import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { BookingStatusTypesEnum } from '../enum/booking-status.types.enum';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true })
  user_id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true })
  shcedule_id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true })
  field_id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true })
  day_id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.Date , required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date , required: true, default: Date.now() })
  updatedAt: Date;

  @Prop({ required: true, default: BookingStatusTypesEnum.PENDING })
  status: BookingStatusTypesEnum;

  @Prop({ type: Number, select: false })
  __v: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
