import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './shcema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create(createUserDto);
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string){
    return await this.userModel.findOne({ email });
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id })
      .populate('bookings')
      .exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
