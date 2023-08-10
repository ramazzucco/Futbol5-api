import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";

export class CreateShceduleDto {
    @ApiProperty({ example: '15:00' })
    readonly time: string;

    @ApiProperty({ example: ['64bc0f0c0a8f5084c374c240'] })
    readonly day: ObjectId;
}