import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';

import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
//import { AllExceptionFilter } from './common/filters/all-exception/all-exception.filter';
import { ConfigService } from '@nestjs/config'; // ✅ ADD

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // ✅ GET CONFIG
  const frontendUrl = configService.get<string>('FRONTEND_URL'); // ✅ READ ENV
  console.warn('frontendUrl::', frontendUrl);
  app.use(cookieParser());
  app.use(helmet());
  /*
  origin: [
    'https://reactjs-cicd-frontend.onrender.com', // ✅ LIVE FRONTEND
  ], 
  */

  app.enableCors({
    origin: [frontendUrl], // ✅ NOW FROM ENV
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
