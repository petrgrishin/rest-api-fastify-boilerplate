import { FastifyInstance } from 'fastify';

export interface PluginInterface {
    register(fastify: FastifyInstance): FastifyInstance;
}
