import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    const status = exception.getStatus();
    const response = exception.getResponse();

    // ✅ ADD LOGS HERE
    console.log('🔥 STATUS:', status);
    console.log('🔥 RESPONSE:', response);

    res.status(status).json({
      success: false,
      message: typeof response === 'string' ? response : (response as any).message,
    });
  }
}
//-------------------------------------------------
/* import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    res.status(exception.getStatus()).json({
      message: exception.message,
    });
  }
} */
