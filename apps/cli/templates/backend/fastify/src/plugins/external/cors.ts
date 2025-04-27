import cors, { type FastifyCorsOptions } from '@fastify/cors';

export const autoConfig: FastifyCorsOptions = {
 methods: ['GET', 'POST', 'PUT', 'DELETE'],
 origin: 'http://localhost:3001',  // EXACT MATCH
 credentials: true,
};

/**
 * This plugins enables the use of CORS.
 *
 * @see {@link https://github.com/fastify/fastify-cors}
 */
export default cors;
