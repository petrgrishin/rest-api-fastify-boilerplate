import { Service } from 'fastify-decorators';
import { FastifyInstance } from 'fastify';
import { AppConfig } from '../config/app.config';
import { PluginInterface } from './plugin.interface';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

@Service()
export class SwaggerPlugin implements PluginInterface {
    constructor(private readonly config: AppConfig) {}

    register(fastify: FastifyInstance): FastifyInstance {
        if (this.config.env !== 'dev') {
            return fastify;
        }

        fastify.register(fastifySwagger, {
            openapi: {
                info: {
                    title: 'Test swagger',
                    description: 'testing the fastify swagger api',
                    version: '0.1.0',
                },
                servers: [
                    {
                        url: `http://${this.config.host}:${this.config.port}`,
                    },
                ],
            },
            hideUntagged: true,
        });

        fastify.register(fastifySwaggerUi, {
            routePrefix: '/docs',
        });

        fastify.log.info(`OpenAPI docs available at http://${this.config.host}:${this.config.port}/docs`);

        return fastify;
    }
}
