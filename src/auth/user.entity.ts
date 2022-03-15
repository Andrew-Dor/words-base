import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/utils/constants';


export interface User extends Base {};

export class User extends TimeStamps {
    @prop()
    name: string;

    @prop({unique: true})
    email: string;

    @prop()
    password: string;

    @prop()
    role: UserRoles;

    @prop()
    refreshToken?: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export const UserModel = getModelForClass(User);
