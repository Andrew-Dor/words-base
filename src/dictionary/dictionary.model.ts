import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import {Schema as MongooseSchema} from "mongoose";


@ObjectType()
export class Dictionary {
    @Field(() => ID)
    _id: MongooseSchema.Types.ObjectId

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    description: string;
}

export const DictionaryModel = getModelForClass(Dictionary);

@InputType()
export class CreateDictionatyParams {
    @Field()
    name: string;

    @Field()
    description: string;
}

export class DictionaryIdParams {
    @Field()
    dictionaryId: string;
}