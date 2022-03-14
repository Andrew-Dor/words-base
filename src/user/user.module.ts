import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../auth/user.entity';

@Module({
  providers: [UserService, UserResolver],
  imports:[
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserModel.schema }
    ]),
  ]
})
export class UserModule {}
