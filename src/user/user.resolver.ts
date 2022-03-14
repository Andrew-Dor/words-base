import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UserType } from '../auth/auth.model';
import { GetUserId } from 'src/utils/decorators/get-user-id.decorator';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(() => UserType, {name: 'getUserInfo'})
    async getUserInfo(
        @GetUserId()
        userId: string,
    ) {
        return await this.userService.getUserInfo(userId);
    }
}
