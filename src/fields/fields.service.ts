import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Field, FieldDocument } from './schema/fields.schema';
import { Model } from 'mongoose';

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field.name) private readonly fieldModel: Model<FieldDocument>,
  ) {}

  create(createFieldDto: CreateFieldDto) {
    return this.fieldModel.create(createFieldDto);
  }

  findAll() {
    return this.fieldModel.find().exec();
  }

  findOne(id: number) {
    return this.fieldModel.findOne({ _id: id }).exec();
  }

  update(id: number, updateFieldDto: UpdateFieldDto) {
    return this.fieldModel.findOneAndUpdate({ _id: id }, updateFieldDto, {
      new: true,
    });
  }

  remove(id: number) {
    return this.fieldModel.findByIdAndRemove({ _id: id }).exec();
  }
}
