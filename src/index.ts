import { startServer } from './app/server.js'
import sequelize from './libs/db/index.js'

// types
import { FastifyInstance } from 'fastify'

const server: FastifyInstance = await startServer()
console.log(process.env.SYNC_DB)
if (process.env.SYNC_DB === 'true') {
  await sequelize?.sync({ force: true })
}

function handleFatalError (err: Error) {
  server.log.error(err)
  process.exit(1)
}

async function closeGracefully (signal: string) {
  server.log.info(`Received signal to terminate: ${signal}`)

  await sequelize?.close()
  server.log.info('Database connection was closed.')

  process.kill(process.pid, signal)
}

process.once('SIGINT', closeGracefully)
process.once('SIGTERM', closeGracefully)
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
process.on('triggerUncaughtException', handleFatalError)
