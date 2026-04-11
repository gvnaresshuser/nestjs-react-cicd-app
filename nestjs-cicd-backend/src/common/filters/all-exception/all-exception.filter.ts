import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let message = 'Internal Server Error';

    if (exception instanceof Error) {
      message = exception.message;
    }

    res.status(500).json({
      success: false,
      message,
    });
  }
}
