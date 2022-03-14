import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '../auth/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserType } from 'src/auth/auth.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.modelName)
        private readonly userModel: ReturnModelType<typeof UserModel>,
    ) {}

    async getUserInfo(userId: string): Promise<UserType> {
        const user = await this.userModel.findOne({id: userId});
        if (!user) {
            throw new InternalServerErrorException();
        }

        return user;
    }
}
