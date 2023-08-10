import { ApiProperty } from "@nestjs/swagger";

export class CreateFieldDto {
  @ApiProperty({ example: 1 })
  readonly id: number;
}
