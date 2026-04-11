import { Injectable } from '@nestjs/common';
import { logger } from '../winston.config'; //THIS WRITES TO FILE
/*
E:\MURALI\NEST-JS\drizzle-nest-advanced\logs
E:\MURALI\NEST-JS\drizzle-nest-advanced\logs>tree /f
Folder PATH listing for volume DATA
Volume serial number is 0ED0-D3D0
E:.
    .477e501c7efb6c82e57cd712bffff552fe74cc51-audit.json
    .dbafb33849809d512a8369328cbfc56dc85a87ab-audit.json
    combined-2026-03-27.log
    error-2026-03-27.log

No subfolders exist
*/
//import { logger } from '../winston.logger';//THIS JUST LOGS TO CONSOLE

@Injectable()
export class MyLoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string) {
    logger.error(message);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
  }
}
//------------------------------------------
/* import { Injectable } from '@nestjs/common';

@Injectable()
export class MyLoggerService {}
 */
