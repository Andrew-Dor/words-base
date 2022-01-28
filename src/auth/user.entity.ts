import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as bcrypt from 'bcrypt';


export interface User extends Base {};

export class User extends TimeStamps {
    @prop()
    name: string;

    @prop({unique: true})
    email: string;

    @prop()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export const UserModel = getModelForClass(User);
