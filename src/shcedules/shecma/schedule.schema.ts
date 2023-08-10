import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Days } from 'src/days/schema/days.schema';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  time: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true }])
  day: ObjectId[];

  @Prop({ type: Number, select: false })
  __v: number;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
