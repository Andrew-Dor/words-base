import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/auth/user.entity";

export const GetUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const gqlCtx = GqlExecutionContext.create(ctx);
        const request = gqlCtx.getContext().req;
        const user: User = request.user;
        return user._id.toString();
    }
);