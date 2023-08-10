import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/shcema/user.schema';
import { Schedule, ScheduleDocument } from 'src/shcedules/shecma/schedule.schema';
import { Field, FieldDocument } from 'src/fields/schema/fields.schema';
import { Days, DaysDocument } from 'src/days/schema/days.schema';
import { BookingStatusTypesEnum } from './enum/booking-status.types.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Field.name) private readonly fieldModel: Model<FieldDocument>,
    @InjectModel(Days.name) private readonly dayModel: Model<DaysDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const user = await this.userModel.findById({ _id: createBookingDto.user_id });
    const schedule: any = await this.scheduleModel.findById({ _id: createBookingDto.shcedule_id });
    const field: any = await this.fieldModel.findById({ _id: createBookingDto.field_id });
    const day: any = await this.dayModel.findById({ _id: createBookingDto.day_id });
    const isAlreadyBooked = await this.bookingModel.findOne({
      day_id: day._id,
      shcedule_id: schedule._id,
      field_id: field._id
    });

    if(isAlreadyBooked) {
      throw new Error('Ya se encuentra reservado!');
    }

    createBookingDto.user_id = user._id;
    createBookingDto.field_id = field._id;
    createBookingDto.day_id = day._id;
    createBookingDto.shcedule_id = schedule._id;
    createBookingDto.status = BookingStatusTypesEnum.PENDING;

    const booking = await this.bookingModel.create(createBookingDto);

    user.bookings.push(booking._id);
    user.save();

    return booking;
  }

  findAll() {
    return this.bookingModel.find().exec();
  }

  findOne(id: string) {
    return this.bookingModel.findOne({ _id: id }).exec();
  }

  remove(id: string) {
    return this.bookingModel.findByIdAndRemove({ _id: id }).exec();
  }
}
