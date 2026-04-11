import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

/*
import * as winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: 'debug', // capture all logs
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // File - all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),

    // File - only errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});
*/
