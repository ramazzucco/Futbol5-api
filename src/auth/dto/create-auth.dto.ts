import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { AuthModel } from "../model/auth.model";

export class CreateAuthDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    user_id: ObjectId;

    @ApiProperty()
    isvalid: boolean = true;

    @ApiProperty()
    createdAt: Date = new Date();

    @ApiProperty()
    updatedAt: Date = new Date();

    constructor(token: string, user_id: ObjectId) {
        this.token = token;
        this.user_id = user_id;
    }
}
