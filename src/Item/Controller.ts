import * as Boom from '@hapi/boom'

import Service from './Service.js'

// types
import { FastifyRequest, FastifyReply } from 'fastify'
import { ItemFilters, ItemInput, ItemParams } from '../interfaces/entities/Item.js'

class Controller {
  static async find ({ query }: FastifyRequest<{ Querystring: ItemFilters }>, reply: FastifyReply) {
    try {
      const data = await Service.find(query)

      return reply.send(data)
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }
      console.log(err)
      throw Boom.internal('Wrong server')
    }
  }

  static async findById ({ params }: FastifyRequest<{ Params: ItemParams }>, reply: FastifyReply) {
    try {
      const data = await Service.findById(params.id)
      return reply.send(data)
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }

      throw Boom.internal('Wrong server')
    }
  }

  static async create ({ body }: FastifyRequest<{ Body: ItemInput }>, reply: FastifyReply) {
    try {
      const data = await Service.create(body)
      return reply.status(201).send(data)
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }

      console.log(err)
      throw Boom.internal('Wrong server')
    }
  }

  static async updateById ({ params, body }: FastifyRequest<{ Params: ItemParams, Body: ItemInput }>, reply: FastifyReply) {
    try {
      const data = await Service.updateById(params.id, body)
      return reply.send(data)
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }

      throw Boom.internal('Wrong server')
    }
  }

  static async deleteById ({ params }: FastifyRequest<{ Params: ItemParams}>, reply: FastifyReply) {
    try {
      await Service.deleteById(params.id)
      return reply.status(204).send({})
    } catch (err) {
      if (Boom.isBoom(err)) {
        return reply.status(err.output.statusCode).send(err.output.payload)
      }

      throw Boom.internal('Wrong server')
    }
  }
}

export default Controller
