import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
    return {
        uri: getMongoConnectStr(configService),
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
};

const getMongoConnectStr = (configService: ConfigService):string => {
    const user = configService.get('MONGO_LOGIN');
    const password = configService.get('MONGO_PASSWORD');
    const host = configService.get('MONGO_HOST');
    const port = configService.get('MONGO_PORT');
    const database = configService.get('MONGO_DATABASE');
    return `mongodb://${user}:${password}@${host}:${port}/${database}`;
}