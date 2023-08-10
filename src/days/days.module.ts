import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Days, DaysSchema } from './schema/days.schema';
import { Schedule, ScheduleSchema } from 'src/shcedules/shecma/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Days.name, schema: DaysSchema },
      { name: Schedule.name, schema: ScheduleSchema }
    ]),
  ],
  controllers: [DaysController],
  providers: [DaysService]
})
export class DaysModule {}
