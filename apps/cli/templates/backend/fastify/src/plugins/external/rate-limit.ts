import fastifyRateLimit from '@fastify/rate-limit'
import type { FastifyInstance } from 'fastify'

export const autoConfig = (fastify: FastifyInstance) => {
  return {
    max: 2000, // max requests per window per IP
    timeWindow: '1 minute'
  }
}

/**
 * This plugins is low overhead rate limiter for your routes.
 *
 * @see {@link https://github.com/fastify/fastify-rate-limit}
 */
export default fastifyRateLimit
