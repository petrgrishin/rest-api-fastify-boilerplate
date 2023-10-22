import { AppConfig } from './config/app.config';
import { Service } from 'fastify-decorators';
import { PinoLoggerOptions } from 'fastify/types/logger';

@Service()
export class Logger {
    constructor(private readonly config: AppConfig) {}

    getLoggerOptions(): PinoLoggerOptions {
        if (this.config.env !== 'dev') {
            return {};
        }
        return {
            level: 'debug',
            transport: {
                target: '@mgcrea/pino-pretty-compact',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    colorize: true,
                },
            },
        };
    }
}
