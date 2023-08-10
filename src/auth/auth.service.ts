import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { Auth, AuthDocument } from './schema/auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/user/model/user.model';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private generatetoken: GenerateTokensService,
    private validateToken: ValidateTokenService,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ){}

  async signIn(email: string, pass: string) {
    const user: any = await this.userService.findByEmail(email);
    if (user && !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    // Crear TOKEN guardarlo en el usuario y devolverlo
    const newToken = this.generatetoken.createToken();
    const auth = new Auth();
    auth.token = newToken;
    auth.user_id = user._id;
    auth.isvalid = true;
    await this.authModel.create(auth);

    user.token = newToken;
    await user.save();

    this.validateToken.checkTokenTimeAndValidate(user);

    return new UserModel(user).getData();
  }
}
