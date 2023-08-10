import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ShcedulesModule } from './shcedules/shcedules.module';
import { FieldsModule } from './fields/fields.module';
import { DaysModule } from './days/days.module';
import { AuthModule } from './auth/auth.module';
import { ValidateTokenService } from './_shared/service/validate-token/validate-token.service';
import { Auth, AuthSchema } from './auth/schema/auth.schema';
import { User, UserSchema } from './user/shcema/user.schema';
import { GenerateTokensService } from './_shared/service/generate-tokens/generate-tokens.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/futbol-5'),
    BookingModule,
    UserModule,
    ShcedulesModule,
    FieldsModule,
    DaysModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ValidateTokenService,
    GenerateTokensService
  ],
})
export class AppModule {}
