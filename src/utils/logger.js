/**
 * Configurations of logger.
 */
import winston from 'winston';
import winstonRotator from 'winston-daily-rotate-file';

const defaultTransports = [
    new winston.transports.Console({
        colorize: true,
    }),
    new winstonRotator({
        filename: './logs/%DATE%.log',
        datePattern: 'yyyy-MM-DD',
        prepend: true,
    }),
];

export const successLogger = winston.createLogger({
    level: 'info',
    transports: defaultTransports,
});

export const errorLogger = winston.createLogger({
    level: 'error',
    transports: defaultTransports,
});
