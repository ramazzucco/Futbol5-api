import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Field, FieldSchema } from './schema/fields.schema';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { User, UserSchema } from 'src/user/shcema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Field.name, schema: FieldSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [FieldsController],
  providers: [
    FieldsService,
    GenerateTokensService,
    ValidateTokenService
  ]
})
export class FieldsModule {}
