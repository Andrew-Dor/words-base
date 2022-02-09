import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUserId } from 'src/utils/decorators/get-user-id.decorator';
import { CreateDictionatyParams, Dictionary } from './dictionary.model';
import { DictionaryService } from './dictionary.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class DictionaryResolver {
    constructor(private dictionaryService: DictionaryService) {}

    @Mutation(() => Dictionary, {name: 'createDictionary'})
    async createDictionary(
        @Args('params', {type: () => CreateDictionatyParams})
        params: CreateDictionatyParams,
        @GetUserId()
        userId: string,
    ) {
        return await this.dictionaryService.createDictionary(params,userId);
    }
}
