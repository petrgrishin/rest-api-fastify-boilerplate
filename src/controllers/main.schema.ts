export const mainSchema = {
    tags: ['api'],
    params: {
        $id: 'IdSchema',
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
            },
        },
        required: ['id'],
    } as const,
    response: {
        200: {
            type: 'object',
            properties: {
                uuid: { type: 'string' },
                config: { type: 'string' },
            },
            required: ['uuid'],
        } as const,
    },
};
