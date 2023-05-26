import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Cryrdle API')
  .setDescription('The Cryrdle API')
  .setVersion('1.0')
  .addTag('cryrdle')
  .build();  

  app.enableCors();
  // app.useGlobalFilters(new HttpExceptionFilter());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  // can choose any 'api' to open swagger interface, eg:localhost:3000/api
  await app.listen(8000);
}
bootstrap();

// running `yarn dlx @yarnpkg/sdks vscode` after initiation didn't work for me
// setup guide: https://github.com/Farber98/encode_general/blob/master/nest.md

// Matheus video on how-to do this
// https://www.youtube.com/watch?v=wokUtS4j0Lk