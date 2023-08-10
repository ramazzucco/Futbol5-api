import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { AuthModel } from "../model/auth.model";

export class UpdateAuthDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    user_id: ObjectId;

    @ApiProperty()
    isvalid: boolean;

    @ApiProperty()
    updatedAt: Date = new Date();

    constructor(auth: AuthModel) {
        this.token = auth.token;
        this.user_id = auth.user_id;
        this.isvalid = auth.isvalid;
    }
}
