import { Module } from '@nestjs/common';
import { ShcedulesService } from './shcedules.service';
import { ShcedulesController } from './shcedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './shecma/schedule.schema';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { User, UserSchema } from 'src/user/shcema/user.schema';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [ShcedulesController],
  providers: [ShcedulesService, GenerateTokensService, ValidateTokenService]
})
export class ShcedulesModule {}
