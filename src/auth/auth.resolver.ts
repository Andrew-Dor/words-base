import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserId } from 'src/utils/decorators/get-user-id.decorator';
import { CreateUserParams, SignInParams, UserType } from './auth.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Resolver(() => UserType)
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) { }

    @Mutation(() => Boolean, { name: 'signUp' })
    async signUp(
        @Args('params', { type: () => CreateUserParams })
        params: CreateUserParams,
    ) {
        return await this.authService.signUp(params);
    }

    @Query(() => UserType, { name: 'signIn' })
    async signIn(
        @Args('params', { type: () => SignInParams })
        params: SignInParams,
        @Context()
        context: any,
    ) {
        const { accessToken, refreshToken, user, userId } = await this.authService.signIn(params);
        await this.authService.setCurrentRefreshToken(refreshToken,userId);
        
        context.res.cookie('Authentication', accessToken, {
            httpOnly: true,
            maxAge: this.configService.get('JWT_EXPIRES'),
        });

        context.res.cookie('Refresh', refreshToken, {
            httpOnly: true,
            maxAge: this.configService.get('JWT_REFRESH_EXPIRES'),
        });

        return user;
    }

    @Query(()=>Boolean, {name: 'logOut'})
    @UseGuards(JwtAuthGuard)
    async logOut(
        @Context()
        context: any,
        @GetUserId()
        userId: string,
    ) {
        await this.authService.clearUserRefreshToken(userId);
        context.res.cookie('Authentication',this.authService.clearAuthCookie());
        context.res.cookie('Refresh',this.authService.clearRefreshCookie());
        return true;
    }

    @Query(() => Boolean, { name: 'refresh' })
    @UseGuards(JwtRefreshGuard)
    async refresh (
        @Context()
        context: any,
        @GetUserId()
        userId: string,
    ) {
        const accessToken = await this.authService.getAccessToken(userId);
        context.res.cookie('Authentication', accessToken, {
            httpOnly: true,
            maxAge: this.configService.get('JWT_EXPIRES'),
        });

        return true;
    }
}