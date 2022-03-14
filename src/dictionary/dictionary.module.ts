import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryResolver } from './dictionary.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionaryModel } from './dictionary.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DictionaryModel.modelName,
        schema: DictionaryModel.schema
      }
    ]),
    AuthModule,
  ],
  providers: [DictionaryService, DictionaryResolver]
})
export class DictionaryModule {}
