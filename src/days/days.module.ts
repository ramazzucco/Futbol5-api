import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Days, DaysSchema } from './schema/days.schema';
import { Schedule, ScheduleSchema } from 'src/shcedules/shecma/schedule.schema';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { User, UserSchema } from 'src/user/shcema/user.schema';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Days.name, schema: DaysSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DaysController],
  providers: [
    DaysService,
    GenerateTokensService,
    ValidateTokenService
  ]
})
export class DaysModule {}
