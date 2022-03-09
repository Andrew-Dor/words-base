import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: true});
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
    allowedHeaders: [
        'accept',
        'apollographql-client-name',
        'content-type',
    ],
    credentials: true,
});
  await app.listen(3000);
}
bootstrap();
