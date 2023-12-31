import { PluginInterface } from './plugin.interface';
import { Service } from 'fastify-decorators';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { JwtConfig } from '../config/jwt.config';
import buildGetJwks from 'get-jwks';
import jwt, { JwtHeader, TokenOrHeader } from '@fastify/jwt';

type JwtPayload = {
    iss: string;
    scope: string;
};

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: JwtPayload;
    }
}

@Service()
export class JwtPlugin implements PluginInterface {
    constructor(private readonly config: JwtConfig) {}

    register(fastify: FastifyInstance): FastifyInstance {
        const jwks = buildGetJwks({
            issuersWhitelist: [this.config.issuer],
            providerDiscovery: true,
        });

        fastify.register(jwt, {
            decode: { complete: true },
            secret: (request: FastifyRequest, tokenOrHeader: TokenOrHeader) => {
                const {
                    header: { kid, alg },
                    payload: { iss },
                } = tokenOrHeader as { header: JwtHeader; payload: { iss: string } };
                return jwks.getPublicKey({ kid, domain: iss, alg });
            },
            verify: {
                allowedIss: this.config.issuer,
                allowedAud: this.config.audience,
            },
        });

        fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const payload = await request.jwtVerify<JwtPayload>();
                if (!payload.scope) {
                    return reply.code(403).send(new Error('Token does not contain scope permissions'));
                }
                const payloadScopes = payload.scope?.split(' ');
                const isAllowedScope = this.config.scopes.every((scope) => payloadScopes.includes(scope));
                if (!isAllowedScope) {
                    return reply.code(403).send(new Error('Token does not available scope permissions'));
                }
            } catch (error) {
                reply.send(error);
            }
        });

        return fastify;
    }
}
