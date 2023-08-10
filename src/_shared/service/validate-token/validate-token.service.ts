import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { AuthModel } from 'src/auth/model/auth.model';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';
import { UserModel } from 'src/user/model/user.model';
import { User, UserDocument } from 'src/user/shcema/user.schema';

@Injectable()
export class ValidateTokenService {
    timeExpiration = 1000 * 60 * 5;
    timeToRemoveExpiredTokens = 1000 * 60 * 60 * 12;

    constructor(
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {
        // this.removeExpirationsTokensOnDB();
    }

    checkTokenTimeAndValidate(user: UserDocument) {
        return setTimeout(async() => {
            const token = user.token;
            const userAuth = await this.authModel.findOne({ token });
            if(userAuth) {
                console.log("INVALIDANDO TOKEN " + user.token);
                userAuth.isvalid = false;
                userAuth.save();
            }
        }, this.timeExpiration);
    }

    removeExpirationsTokensOnDB() {
        setInterval(async() => {
            await this.authModel.deleteMany({ isvalid: false });
        }, this.timeToRemoveExpiredTokens);
    }
}
