import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    console.log(`${req.method} ${fullUrl}`);

    next();
  }
}
//------------------------------------------------------------
/* import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
} */
