import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AccessTokenObject, CreateUserParams, SignInParams } from './auth.model';
import { UserModel } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from 'src/utils/constants';
import { IJwtPayload } from './auth.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.modelName)
        private readonly userModel: ReturnModelType<typeof UserModel>,
        private jwtService: JwtService,
    ) {}

    
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async signUp(params: CreateUserParams): Promise<boolean> {
        const { email, name, password } = params;

        const hashPassword = await this.hashPassword(password);
        const newUser = new this.userModel({
            email,
            password: hashPassword,
            name,
        });

        try {
            await newUser.save();
            return true;
        } catch (error) {
            if (error.code === ErrorCodes.DUPLICATE_USER) {
                throw new ConflictException('This email has already exists!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(params: SignInParams): Promise<AccessTokenObject> {
        const username = await this.validateUserPassword(params);
        if (!username) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload: IJwtPayload = { username, email: params.email };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

    async validateUserPassword(params: SignInParams): Promise<string> {
        const { email, password } = params;
        const user = await this.userModel.findOne({email});

        if (user && (await user.validatePassword(password))) {
            return user.name;
        }
        return null;
    }


}
