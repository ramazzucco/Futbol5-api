import { Schedule } from "src/shcedules/shecma/schedule.schema";
import { UpdateDayDto } from "../dto/update-day.dto";
import { ObjectId } from "mongoose";

export class DayModel {
    id: string;
    name: string;
    schedules: ObjectId[];

    constructor(item: UpdateDayDto, schedules?: Schedule[]) {
        this.id = item.id;
        this.name = item.name;
        if(schedules) this.setSchedules(schedules, item.schedules);
    }

    setSchedules(schedules: Schedule[], schedulesIds: string[]) {
        this.schedules = schedules.filter((shcedule: Schedule) => schedulesIds.includes(shcedule.id))
            .map((schedule: any) => schedule._id);
    }
}