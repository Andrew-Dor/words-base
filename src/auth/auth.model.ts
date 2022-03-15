import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { UserRoles } from 'src/utils/constants';

registerEnumType(UserRoles,{name: 'UserRoles'});

@ObjectType('User')
export class UserType {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field(() => UserRoles)
    role: UserRoles;
}

@InputType()
export class CreateUserParams {
    @Field()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak!',
    })
    password: string;
}

@InputType()
export class SignInParams {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    password: string;
}

@ObjectType()
export class AccessTokenObject {
    @Field()
    accessToken: string;
}
