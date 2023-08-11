import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/shcema/user.schema';
import { Auth, AuthSchema } from './schema/auth.schema';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    GenerateTokensService,
    ValidateTokenService,
  ],
})
export class AuthModule {}
