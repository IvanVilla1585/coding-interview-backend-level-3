import Fastify, { FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'

import initRoutes from '../routes/index.js'
import errorHandle from '../middlewares/error.js'

const getServer = () => {
  const server: FastifyInstance = Fastify({
    logger: true
  })

  server.register(helmet)
  server.register(cors)

  server.setErrorHandler(errorHandle)

  initRoutes(server)

  return server
}

export async function startServer (): Promise<FastifyInstance> {
  const server: FastifyInstance = getServer()

  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0'
    })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

    server.log.info(`Server is running on port ${port} `)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }

  return server
}
