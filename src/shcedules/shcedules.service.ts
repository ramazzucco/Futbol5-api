import { Injectable } from '@nestjs/common';
import { CreateShceduleDto } from './dto/create-shcedule.dto';
import { UpdateShceduleDto } from './dto/update-shcedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './shecma/schedule.schema';
import { Model } from 'mongoose';
import { ScheduleModel } from './model/shcedule.model';

@Injectable()
export class ShcedulesService {
  constructor(
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(createShceduleDto: CreateShceduleDto) {
    const schedules = (await this.scheduleModel.find().exec()).sort((a: any,b:any) => a.id - b.id);
    const newTime = createShceduleDto.time.split(':')[0] === '00' ? 24 : Number(createShceduleDto.time.split(':')[0]);
    const firstTime = Number(schedules[0].time.split(':')[0]);
    const lastTime = Number(schedules[schedules.length - 1].time.split(':')[0]);
    const newSchedules = [];

    if(newTime < firstTime) {
      newSchedules.push(new ScheduleModel('1', createShceduleDto.time));
      schedules.map((schedule: Schedule) => {
        schedule.id = (Number(schedule.id) + 1).toString();
        newSchedules.push(schedule);
      });
    } else if(newTime > lastTime) {
      const id = (Number(schedules[schedules.length - 1].id) + 1).toString();
      newSchedules.push(new ScheduleModel(id, createShceduleDto.time));
    }

    return this.scheduleModel.create(newSchedules);
  }

  findAll() {
    return this.scheduleModel.find().exec();
  }

  findOne(id: string) {
    return this.scheduleModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateShceduleDto: UpdateShceduleDto) {
    return this.scheduleModel.findOneAndUpdate({ _id: id }, updateShceduleDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.scheduleModel.findByIdAndRemove({ _id: id }).exec();
  }
}
