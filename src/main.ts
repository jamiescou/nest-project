import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as helmet from 'helmet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rateLimit = require('express-rate-limit');
// import * as rateLimit from 'express-rate-limit';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api'); // 全局路由前缀
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  // app.useStaticAssets(path.join(__dirname, '..', 'public'), {
  //   prefix: '/public/',
  // });
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 50, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useStaticAssets('public', {
    prefix: '/storage/',
  });
  app.setBaseViewsDir('views');
  // app.setBaseViewsDir(path.join(__dirname, '.', 'views'));
  app.setViewEngine('ejs');
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    // .setHost('http://www.baidu.com')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(9080);
}
bootstrap();
