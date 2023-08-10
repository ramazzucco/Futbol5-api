import { ApiProperty } from '@nestjs/swagger';
import { RoleTypesEnum } from '../enum/role-types.enum';
import { ObjectId } from 'mongoose';
import { IsArray, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ramiro Mazzucco' })
  @IsNotEmpty({ message: 'FULLNAME_IS_REQUIRED' })
  @IsString()
  @MinLength(3, { message: 'FULLNAME_MIN_LENGTH' })
  @MaxLength(25, { message: 'FULLNAME_MAX_LENGTH' })
  fullname: string;

  @ApiProperty({ example: 'ramiro.mazzucco@gmail.com' })
  @IsNotEmpty({ message: 'EMAIL_IS_REQUIRED' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({ example: '3415-888666' })
  @IsNotEmpty({ message: 'PHONE_IS_REQUIRED' })
  phone: string;

  @ApiProperty({ example: RoleTypesEnum.ADMIN })
  @IsNotEmpty({ message: 'ROLE_IS_REQUIRED' })
  @IsEnum(RoleTypesEnum, { message: 'INVALID_ROLE' })
  role: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'PASSWORD_IS_REQUIRED' })
  @MinLength(8, { message: 'PASSWORD_MIN_LENGTH' })
  @MaxLength(18, { message: 'PASSWORD_MAX_LENGTH' })
  password: string;

  @ApiProperty({ example: ['64bb0ce987315ad8dcb73171'], default: [] })
  @IsArray()
  bookings: ObjectId[];
}
