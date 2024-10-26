import { FastifyInstance } from 'fastify'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function dailyDietRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdExists)
  app.post('/', async (request, reply) => {
    const createDailyDietSchema = z.object({
      name: z.string(),
      description: z.string(),
      dateHour: z.string(),
      onDiet: z.boolean().nullable().default(false),
    })

    const { userId } = request.cookies

    const { name, description, dateHour, onDiet } = createDailyDietSchema.parse(
      request.body,
    )

    await knex('daily_diet').insert({
      id: randomUUID(),
      name,
      description,
      date_hour: dateHour,
      on_diet: onDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.get('/', async (request) => {
    const { userId } = request.cookies

    const dailyDiets = await knex('daily_diet').where('user_id', userId)

    return {
      dailyDiets,
    }
  })

  app.get('/:id', async (request) => {
    const { userId } = request.cookies

    const getDailyDietSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getDailyDietSchema.parse(request.params)

    const dailyDiet = await knex('daily_diet')
      .where('user_id', userId)
      .where('id', id)

    return {
      dailyDiet,
    }
  })

  app.delete('/:id', async (request, reply) => {
    const { userId } = request.cookies

    const getDailyDietSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getDailyDietSchema.parse(request.params)

    await knex('daily_diet').where('user_id', userId).where('id', id).del()

    reply.status(204).send()
  })

  app.put('/:id', async (request, reply) => {
    const { userId } = request.cookies

    const getDailyDietSchemaParams = z.object({
      id: z.string().uuid(),
    })

    const getDailyDietSchemaBody = z.object({
      name: z.string(),
      description: z.string(),
      dateHour: z.string(),
      onDiet: z.boolean().nullable().default(false),
    })

    const { id } = getDailyDietSchemaParams.parse(request.params)

    const { name, description, dateHour, onDiet } =
      getDailyDietSchemaBody.parse(request.body)

    await knex('daily_diet').where('user_id', userId).where('id', id).update({
      name,
      description,
      date_hour: dateHour,
      on_diet: onDiet,
    })

    const newDailyDiet = await knex('daily_diet')
      .where('user_id', userId)
      .where('id', id)

    return {
      newDailyDiet,
    }
  })

  app.get('/summary', async (request) => {
    const { userId } = request.cookies

    const dailyDietCount = await knex('daily_diet')
      .where('user_id', userId)
      .count()

    return {
      quantityOfDiets: dailyDietCount,
    }
  })

  app.get('/summary/onDiet', async (request) => {
    const { userId } = request.cookies

    const dailyDietCount = await knex('daily_diet')
      .where('user_id', userId)
      .where('on_diet', true)
      .count()

    return {
      quantityOfDiets: dailyDietCount,
    }
  })

  app.get('/greatestSequence', async (request) => {
    const { userId } = request.cookies

    const allDailyDiet = await knex('daily_diet').where('user_id', userId)

    let count = 0
    let greatestSequence = 0

    allDailyDiet.forEach((dailyDiet) => {
      if (dailyDiet.on_diet) {
        count++

        if (greatestSequence < count) {
          greatestSequence = count
        }
      } else {
        count = 0
      }
    })

    return {
      bestSequence: greatestSequence,
    }
  })
}
