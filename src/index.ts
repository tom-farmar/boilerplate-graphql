import 'reflect-metadata'
import { __prod__ } from './constants'
import { createTypeormConn } from './utils/createTypeormConn'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { HelloResolver } from './resolvers/hello'

const main = async () => {
  await createTypeormConn()

  const app = express()

  const redisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: 'soid',
      store: new redisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365.25 * 8, // 8 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: 'smisland island',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main()
