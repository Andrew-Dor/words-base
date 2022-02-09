import { Args, Context, GqlExecutionContext, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
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

    // @Query(() => AccessTokenObject, { name: 'signIn' })
    // async signIn(
    //     @Args('params', { type: () => SignInParams })
    //     params: SignInParams,
    // ) {
    //     return await this.authService.signIn(params);
    // }

    @Query(() => Boolean, { name: 'signIn' })
    async signIn(
        @Args('params', { type: () => SignInParams })
        params: SignInParams,
        @Context() 
        context: any
    ) {
        const {accessToken}: AccessTokenObject = await this.authService.signIn(params);

        context.res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 31,
          });
          console.log('RESP',context);
          
        return true;
    }
}
