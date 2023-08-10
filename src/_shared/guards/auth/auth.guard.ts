import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { GenerateTokensService } from 'src/_shared/service/generate-tokens/generate-tokens.service';
import { ValidateTokenService } from 'src/_shared/service/validate-token/validate-token.service';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { AuthModel } from 'src/auth/model/auth.model';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';
import { User, UserDocument } from 'src/user/shcema/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private generateToken: GenerateTokensService,
    private validateToken: ValidateTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.userModel.findOne({ token });
      const auth = await this.authModel.find({ user_id: user._id });
      const validToken = auth.find((auth: AuthModel) => auth.isvalid);

      if(!validToken || (validToken && validToken.token !== token)) {
        throw new UnauthorizedException();
      }

      const currentTime = new Date().getTime();
      let invalidateTokenFn: NodeJS.Timeout;
      const timeToUpdateToken = currentTime - validToken.updatedAt.getTime();
      // console.log("RENOVAR TOKEN?: ","mayor que - ",(1000*60), "timeToUpdateToken - ", timeToUpdateToken, "menor que - ",(1000*90))
      if(timeToUpdateToken >= (1000*60*4) && timeToUpdateToken <= 1000*60*5) {
        if(invalidateTokenFn) clearTimeout(invalidateTokenFn);
        // console.log("RENOVANDO TOKEN " + user._id)
        const newToken = this.generateToken.createToken();
        user.token = newToken;
        await user.save();
        const newAuth = new CreateAuthDto(newToken,user._id);
        await this.authModel.create(newAuth);
        await this.authModel.deleteOne({ token: validToken.token });
        invalidateTokenFn = this.validateToken.checkTokenTimeAndValidate(user);
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}