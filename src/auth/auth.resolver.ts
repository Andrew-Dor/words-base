import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {

    @Query(() => String)
    sayHello(): string {
        return 'Hello'
    }

    // @Query(() => AccessTokenObject, { name: 'signIn' })
    // async signIn(
    //     @Args('params', { type: () => SignInParams })
    //     params: SignInParams,
    // ) {
    //     return await this.authService.signIn(params);
    // }
}
