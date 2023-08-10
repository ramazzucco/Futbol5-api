import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { Schedule, ScheduleSchema } from 'src/shcedules/shecma/schedule.schema';
import { User, UserSchema } from 'src/user/shcema/user.schema';
import { Field, FieldSchema } from 'src/fields/schema/fields.schema';
import { Days, DaysSchema } from 'src/days/schema/days.schema';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Field.name, schema: FieldSchema },
      { name: Days.name, schema: DaysSchema },
      { name: Auth.name, schema: AuthSchema },
    ])
  ],
  controllers: [BookingController],
  providers: [BookingService, GenerateTokensService, ValidateTokenService]
})
export class BookingModule {}
