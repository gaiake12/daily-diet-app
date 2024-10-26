import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    let userId = request.cookies.userId

    if (userId) {
      return reply.status(401).send()
    }

    userId = randomUUID()

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    await knex('users').insert({
      id: userId,
      name,
    })

    return reply.status(201).send()
  })
}
