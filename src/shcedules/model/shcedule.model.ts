import { ObjectId } from "mongoose";

export class ScheduleModel {
    id: string;
    time: string;
    day: ObjectId[] = [];

    constructor(id: string, time: string) {
        this.id = id;
        this.time = time;
    }
}