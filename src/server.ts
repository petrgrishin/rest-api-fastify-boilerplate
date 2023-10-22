import 'reflect-metadata';
import createFastify, { FastifyInstance } from 'fastify';
import { bootstrap, getInstanceByToken } from 'fastify-decorators';
import fastifyGracefulExit from '@mgcrea/fastify-graceful-exit';
import { AppConfig } from './config/app.config';
import { MainController } from './controllers/main.controller';
import { SwaggerPlugin } from './plugins/swagger.plugin';
import { Logger } from './logger';
import { JwtPlugin } from './plugins/jwt.plugin';

const appConfig = getInstanceByToken(AppConfig);
const logger = getInstanceByToken(Logger);

const swaggerPlugin = getInstanceByToken(SwaggerPlugin);
const jwtPlugin = getInstanceByToken(JwtPlugin);

const fastify: FastifyInstance = createFastify({
    logger: logger.getLoggerOptions(),
    disableRequestLogging: true,
});

fastify.register(fastifyGracefulExit, { timeout: 3000 });
fastify.register(bootstrap, {
    controllers: [MainController],
});

const start = async () => {
    try {
        swaggerPlugin.register(fastify);
        jwtPlugin.register(fastify);

        await fastify.listen({
            port: appConfig.port,
            host: appConfig.host,
        });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start().catch((error) => {
    console.error(error);
    process.exit(1);
});
