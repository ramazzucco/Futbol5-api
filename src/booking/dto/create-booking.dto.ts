import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { BookingStatusTypesEnum } from '../enum/booking-status.types.enum';

export class CreateBookingDto {
  @ApiProperty({ example: '64baf5e41fb00d60dff94bde' })
  user_id: ObjectId;

  @ApiProperty({ example: "64bc0eca0a8f5084c374c22e" })
  shcedule_id: ObjectId;

  @ApiProperty({ example: "64bb0ce987315ad8dcb7316f" })
  field_id: ObjectId;

  @ApiProperty({ example: "64bc0f0c0a8f5084c374c243" })
  day_id: ObjectId;

  @ApiProperty({ example: BookingStatusTypesEnum.PENDING })
  status: BookingStatusTypesEnum;
}
