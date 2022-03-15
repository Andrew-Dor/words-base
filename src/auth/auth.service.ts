import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateUserParams, SignInParams, UserType } from './auth.model';
import { User, UserModel } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorCodes, UserRoles } from 'src/utils/constants';
import { IJwtPayload, IUserTokens } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.modelName)
        private readonly userModel: ReturnModelType<typeof UserModel>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }


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
            role: UserRoles.USER,
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

    async signIn(params: SignInParams): Promise<IUserTokens & { user: UserType }> {
        const user = await this.validateUserPassword(params);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const { email, name, role } = user;
        const payload: IJwtPayload = { username: name, email };
        const accessToken = await this.jwtService.sign(payload);
        const refreshToken = await this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
        });

        return {
            accessToken,
            refreshToken,
            user: { email: email, name: name, role: role },
            userId: user.id,
        };
    }

    async getAccessToken(userId: string): Promise<string> {
        const user = await this.userModel.findOne({id: userId});
        const { email, name } = user;
        const payload: IJwtPayload = { username: name, email };
        const accessToken = await this.jwtService.sign(payload);
        return accessToken;
    }

    async validateUserPassword(params: SignInParams): Promise<User> {
        const { email, password } = params;
        const user = await this.userModel.findOne({ email });

        if (user && (await user.validatePassword(password))) {
            return user;
        }
        return null;
    }

    clearAuthCookie() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    clearRefreshCookie() {
        return `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findOneAndUpdate({ id: userId }, { refreshToken: currentHashedRefreshToken });
    }

    async getUserWithRefreshToken(refreshToken: string, userEmail: string) {
        const user = await this.userModel.findOne({ email: userEmail });
        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async clearUserRefreshToken(userId: string) {
        await this.userModel.findOneAndUpdate({id: userId},{refreshToken: null});
    }

}
