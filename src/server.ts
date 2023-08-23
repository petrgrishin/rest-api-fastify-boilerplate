import 'reflect-metadata';
import createFastify from 'fastify';
import { bootstrap, getInstanceByToken } from 'fastify-decorators';
import fastifyGracefulExit from '@mgcrea/fastify-graceful-exit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { AppConfig } from './config/app.config';
import { MainController } from './controllers/main.controller';

const appConfig = getInstanceByToken<AppConfig>(AppConfig);

let loggerOptions = {};
if (appConfig.env === 'dev') {
    loggerOptions = {
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

const fastify = createFastify({
    logger: loggerOptions,
    disableRequestLogging: true,
});

if (appConfig.env === 'dev') {
    fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Test swagger',
                description: 'testing the fastify swagger api',
                version: '0.1.0',
            },
            servers: [
                {
                    url: `http://${appConfig.host}:${appConfig.port}`,
                },
            ],
        },
        hideUntagged: true,
    });

    fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    });
}

fastify.register(fastifyGracefulExit, { timeout: 3000 });
fastify.register(bootstrap, {
    controllers: [MainController],
});

const start = async () => {
    try {
        await fastify.listen({
            port: appConfig.port,
            host: '127.0.0.1',
        });
        if (appConfig.env === 'dev') {
            fastify.log.info(`OpenAPI docs available at http://${appConfig.host}:${appConfig.port}/docs`);
        }
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start().catch((error) => {
    console.error(error);
    process.exit(1);
});
