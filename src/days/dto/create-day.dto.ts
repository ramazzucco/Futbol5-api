import { ApiProperty } from '@nestjs/swagger';

export class CreateDayDto {
  @ApiProperty({ example: "1" })
  readonly id: string;

  @ApiProperty({ example: 'Lunes' })
  readonly name: string;

  @ApiProperty({ example: ["1", "2", "3", "4", "5", "6"]})
  schedules: string[];
}
