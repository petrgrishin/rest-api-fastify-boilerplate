import { Service } from 'fastify-decorators';
import { Config, Option } from 'config-decorator';

@Service()
@Config('jwt')
export class JwtConfig {
    @Option({
        type: 'string',
    })
    public readonly issuer!: string;

    @Option({
        type: 'string',
        transform: JSON.parse,
    })
    public readonly audience!: string[];

    @Option({
        type: 'string',
        transform: JSON.parse,
    })
    public readonly scopes!: string[];
}
