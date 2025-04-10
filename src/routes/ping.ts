// types
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default function (server: FastifyInstance) {
  server.get(
    '/ping',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              ok: {
                type: 'boolean',
                errorMessage: {
                  type: 'Ok must be a boolean!'
                }
              }
            },
            required: ['ok']
          }
        }
      }
    },
    (request: FastifyRequest, reply: FastifyReply) => {
      return reply.status(200).send({ ok: true })
    }
  )
}
