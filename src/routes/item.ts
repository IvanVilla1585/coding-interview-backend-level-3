import controller from '../Item/Controller.js'
import errorResponse from '../schemas/errorResponse.js'
import { id, filter, create, update, item, filterResponse } from '../schemas/item.js'

// types
import { FastifyInstance } from 'fastify'

export default function (server: FastifyInstance) {
  server.get(
    '/items',
    {
      schema: {
        querystring: filter,
        response: {
          200: filterResponse,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
          500: errorResponse
        }
      }
    },
    controller.find.bind(controller)
  )

  server.get(
    '/items/:id',
    {
      schema: {
        params: id,
        response: {
          200: item,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
          500: errorResponse
        }
      }
    },
    controller.findById.bind(controller)
  )

  server.post(
    '/items',
    {
      schema: {
        body: create,
        response: {
          201: item,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
          500: errorResponse
        }
      }
    },
    controller.create.bind(controller)
  )

  server.patch(
    '/items/:id',
    {
      schema: {
        params: id,
        body: update,
        response: {
          200: item,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
          500: errorResponse
        }
      }
    },
    controller.updateById.bind(controller)
  )

  server.delete(
    '/items/:id',
    {
      schema: {
        params: id,
        response: {
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
          500: errorResponse
        }
      }
    },
    controller.deleteById.bind(controller)
  )
}
