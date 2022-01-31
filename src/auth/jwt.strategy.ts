import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from './auth.types';
import { User, UserModel } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(UserModel.modelName)
        private readonly userModel: ReturnModelType<typeof UserModel>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: IJwtPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
