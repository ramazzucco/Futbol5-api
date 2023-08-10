import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SigninAuthDto {
  @ApiProperty({ example: 'ramiro.mazzucco@gmail.com' })
  @IsNotEmpty({ message: 'EMAIL_IS_REQUIRED' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({ example: 'ramiromazzucco' })
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @MinLength(8, { message: 'PASSWORD_MIN_LENGTH' })
  @MaxLength(18, { message: 'PASSWORD_MAX_LENGTH' })
  password: string;
}
