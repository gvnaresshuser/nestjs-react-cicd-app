import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '7d',
    }),

    new DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '14d',
    }),
  ],
});
//-------------------------------------------------------------------

/* import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = 'logs';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, context, stack }) => {
    return `${timestamp} [${level}] ${context || 'App'}: ${stack || message}`;
});

export const winstonConfig = {
    level: 'debug', // capture all levels
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
    ),
    transports: [
        // 🔹 Console
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'HH:mm:ss' }),
                logFormat
            ),
        }),

        // 🔹 All logs
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
            maxFiles: '7d',
        }),

        // 🔹 Error logs only
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
            maxFiles: '14d',
        }),
    ],
}; */
