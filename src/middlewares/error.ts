import * as Boom from '@hapi/boom'

// types
import { FastifyRequest, FastifyReply } from 'fastify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function error (error: any, request: FastifyRequest, reply: FastifyReply) {
  if (error.isBoom) {
    return reply.status(error.output.statusCode).send(error.output.payload)
  }

  if (error.statusCode === 400) {
    let message: string = error.message

    if (Array.isArray(error.validation)) {
      message = error.validation[0]?.message
    }

    const err = Boom.badRequest(message)

    return reply.status(err.output.statusCode).send(err.output.payload)
  }

  request.log.error(error)

  const newError = Boom.internal()

  return reply.status(newError.output.statusCode).send(newError.output.payload)
}
