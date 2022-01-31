import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenObject, CreateUserParams, SignInParams, UserType } from './auth.model';
import { AuthService } from './auth.service';


@Resolver(() => UserType)
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => Boolean, { name: 'signUp' })
    async signUp(
        @Args('params', { type: () => CreateUserParams })
        params: CreateUserParams,
    ) {
        return await this.authService.signUp(params);
    }

    @Query(() => AccessTokenObject, { name: 'signIn' })
    async signIn(
        @Args('params', { type: () => SignInParams })
        params: SignInParams,
    ) {
        return await this.authService.signIn(params);
    }
}
