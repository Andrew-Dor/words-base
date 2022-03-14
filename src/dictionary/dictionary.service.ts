import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateDictionatyParams, DictionaryModel } from './dictionary.model';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectModel(DictionaryModel.modelName)
        private readonly dictionaryModel: ReturnModelType<typeof DictionaryModel>
    ) {}

    async createDictionary(params: CreateDictionatyParams, userId: string) {
        const {name,description} = params;
        return await this.dictionaryModel.create({
            name,
            description,
        })
    };


}
