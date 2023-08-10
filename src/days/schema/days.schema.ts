import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Schedule } from 'src/shcedules/shecma/schedule.schema';

export type DaysDocument = Days & Document;

@Schema()
export class Days {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true }])
  schedules: ObjectId[];

  @Prop({ type: Number, select: false })
  __v: number;
}

export const DaysSchema = SchemaFactory.createForClass(Days);
