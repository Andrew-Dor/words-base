export interface IJwtPayload {
    email: string;
    username: string;
}

export interface IUserTokens {
    accessToken: string;
    refreshToken: string;
    userId: string;
}