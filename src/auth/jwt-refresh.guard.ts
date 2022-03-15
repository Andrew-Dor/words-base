import { AuthGuard } from '@nestjs/passport';
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        return super.canActivate(new ExecutionContextHost([req]));
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException(); //? exception?
        }
        return user;
    }
}
