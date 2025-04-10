import * as Boom from '@hapi/boom'

// types
import { FastifyRequest, FastifyReply } from 'fastify'

class Controller<
  Model,
  Filters,
  Input,
  Response,
  Params extends { id: number },
  T extends {
  find: (filters: Filters) => Promise<Response>
  findById: (id: number) => Promise<Model>
  create: (input: Input) => Promise<Model>
  updateById: (id: number, input: Input) => Promise<Model>
  deleteById: (id: number) => Promise<Model>
}> {
  private service: T

  constructor (service: T) {
    this.service = service
  }

  async find (request: FastifyRequest<{ Querystring: Filters }>, reply: FastifyReply): Promise<Response> {
    try {
      const filters = request.query as Filters
      const data = await this.service.find(filters)

      return reply.send(data)
    } catch (err) {
      return this.errorHandle(err, request, reply)
    }
  }

  async findById (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply): Promise<Model> {
    try {
      const params = request.params as Params
      const data = await this.service.findById(params.id)

      return reply.send(data)
    } catch (err) {
      return this.errorHandle(err, request, reply)
    }
  }

  async create (request: FastifyRequest<{ Body: Input }>, reply: FastifyReply): Promise<Model> {
    try {
      const input = request.body as Input
      const data = await this.service.create(input)

      return reply.status(201).send(data)
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }

      console.log(err)
      throw Boom.internal()
    }
  }

  async updateById (request: FastifyRequest<{ Params: Params, Body: Input }>, reply: FastifyReply): Promise<Model> {
    try {
      const input = request.body as Input
      const params = request.params as Params
      const data = await this.service.updateById(params.id, input)

      return reply.send(data)
    } catch (err) {
      return this.errorHandle(err, request, reply)
    }
  }

  async deleteById (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply): Promise<Model> {
    try {
      const params = request.params as Params
      await this.service.deleteById(params.id)

      return reply.status(204).send({})
    } catch (err) {
      return this.errorHandle(err, request, reply)
    }
  }

  private errorHandle (err: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (Boom.isBoom(err)) {
      return reply.status(err.output.statusCode).send(err.output.payload)
    }

    request.log.error(err)

    throw Boom.internal()
  }
}

export default Controller
