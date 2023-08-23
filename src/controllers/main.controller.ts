import { Controller, GET, Hook } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AppConfig } from '../config/app.config';
import { mainSchema } from './main.schema';

@Controller({
    route: '/',
})
export class MainController {
    constructor(private readonly config: AppConfig) {}

    @GET('/id/:id', {
        schema: mainSchema,
    })
    async action(
        request: FastifyRequest<{ Params: FromSchema<typeof mainSchema.params> }>,
    ): Promise<FromSchema<(typeof mainSchema.response)['200']>> {
        return {
            uuid: request.params.id,
            config: this.config.port.toString(10),
        };
    }

    @Hook('onError')
    async setPoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        reply.header('X-Powered-By', 'Tell me who');
    }
}
