import initPingRoutes from './ping.js'
import initItemRoutes from './item.js'

// types
import { FastifyInstance } from 'fastify'

export default function initRoutes (server: FastifyInstance) {
  initPingRoutes(server)
  initItemRoutes(server)
}
