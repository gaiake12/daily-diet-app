import fastify from 'fastify'
import { userRoutes } from './routes/user'
import cookie from '@fastify/cookie'
import { dailyDietRoutes } from './routes/dailyDiet'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user',
})

app.register(dailyDietRoutes, {
  prefix: 'dailyDiet',
})
