import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shcema/user.schema';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ValidateTokenService,
    GenerateTokensService
  ],
})
export class UserModule {}
