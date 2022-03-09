import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserParams, SignInParams, UserType } from './auth.model';
import { AuthService } from './auth.service';


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
        const { accessToken, user } = await this.authService.signIn(params);
        
        context.res.cookie('Authentication', accessToken, {
            httpOnly: true,
            maxAge: this.configService.get('JWT_EXPIRES'),
        });

        return user;
    }
}
