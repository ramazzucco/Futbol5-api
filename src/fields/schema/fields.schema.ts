import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldDocument = Field & Document;

@Schema()
export class Field {
  @Prop({ required: true })
  id: number;

  @Prop({ type: Number, select: false })
  __v: number;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
