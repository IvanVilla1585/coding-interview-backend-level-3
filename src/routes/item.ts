import Controller from '../Item/Controller.js'
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
          200: filterResponse
        }
      }
    },
    Controller.find
  )

  server.get(
    '/items/:id',
    {
      schema: {
        params: id,
        response: {
          200: item
        }
      }
    },
    Controller.findById
  )

  server.post(
    '/items',
    {
      schema: {
        body: create,
        response: {
          201: item
        }
      }
    },
    Controller.create
  )

  server.patch(
    '/items/:id',
    {
      schema: {
        params: id,
        body: update,
        response: {
          200: item
        }
      }
    },
    Controller.updateById
  )

  server.delete(
    '/items/:id',
    {
      schema: {
        params: id
      }
    },
    Controller.deleteById
  )
}
