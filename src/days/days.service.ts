import { Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Days, DaysDocument } from './schema/days.schema';
import { Model, ObjectId } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/shcedules/shecma/schedule.schema';
import { DayModel } from './model/day.model';

@Injectable()
export class DaysService {
  constructor(
    @InjectModel(Days.name) private readonly daysModel: Model<DaysDocument>,
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(createDayDto: CreateDayDto) {
    const schedules = await this.scheduleModel.find().exec();
    const newDay = new DayModel(createDayDto, schedules);
    return this.daysModel.create(newDay);
  }

  findAll() {
    return this.daysModel.find()
      .populate('schedules', { _id: 0, day: 0 })
      .exec();
  }

  async findOne(id: string) {
    const day = await this.daysModel.find({ _id: id })
      .populate('schedules', { _id: 0, day: 0 })
      .exec();
    return day;
  }

  async update(id: string, updateDayDto: UpdateDayDto) {
    const schedules = await this.scheduleModel.find();
    let itemToUpdate: any = updateDayDto;
    if(updateDayDto.schedules) {
      const day = await this.daysModel.findById({ _id: id });
      let newSchedules: ObjectId[] = schedules.filter((shcedule: Schedule) => updateDayDto.schedules.includes(shcedule.id))
        .map((schedule: any) => schedule._id);
      newSchedules = [
        ...day.schedules,
        ...newSchedules.filter((scheduleId: any) => !day.schedules.includes(scheduleId))
      ];
      itemToUpdate = {
        ...itemToUpdate,
        schedules: newSchedules
      }
    }
    return this.daysModel.findOneAndUpdate({ _id: id }, itemToUpdate, {
      new: true,
    });
  }

  remove(id: string) {
    return this.daysModel.findByIdAndRemove({ _id: id }).exec();
  }
}
