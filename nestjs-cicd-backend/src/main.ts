import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';

import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
//import { AllExceptionFilter } from './common/filters/all-exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet());

  /* http://localhost:5173 */

  app.enableCors({
    origin: 'https://reactjs-cicd-frontend.onrender.com',
    credentials: true,
  });

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Global Interceptor
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  // Global Filter
  //app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
//-----------------------------------
/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
 */
