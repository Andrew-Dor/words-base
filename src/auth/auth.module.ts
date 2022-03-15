import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  providers: [AuthService, AuthResolver, JwtStrategy, JwtRefreshStrategy],
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
          expiresIn: process.env.JWT_EXPIRES,
      },
  }),
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserModel.schema }
    ])
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
