import request from 'supertest'

import { startServer } from '../src/app/server.js'
import sequelize from '../src/libs/db/index.js'

// types
import { FastifyInstance } from 'fastify'

describe('E2E Tests', () => {
  let server: FastifyInstance

  beforeAll(async () => {
    server = await startServer()
    await sequelize?.authenticate()
    await sequelize?.sync({ force: true })
  })

  it('should get a response with status code 200', async () => {
    const response = await request(server.server).get('/ping')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  });

  describe('Basic Items functionality', () => {
    it('should be able to list all items', async () => {
      const response = await request(server.server).get('/items')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: [], total: 0 })

      await request(server.server)
        .post('/items')
        .send({ name: 'Item 1', price: 10 })
        .set('Accept', 'application/json')

      const response2 = await request(server.server).get('/items')

      expect(response2.status).toBe(200)
      expect(response2.body).toEqual({
        data: [{
          id: expect.any(Number),
          name: 'Item 1',
          price: 10,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }],
        total: 1
      })
    })

    it('should be able to list items by filters', async () => {
      await Promise.all([
        request(server.server)
          .post('/items')
          .send({ name: 'Item 11', price: 10 })
          .set('Accept', 'application/json'),
        request(server.server)
          .post('/items')
          .send({ name: 'Item 12', price: 10 })
          .set('Accept', 'application/json'),
        request(server.server)
          .post('/items')
          .send({ name: 'Item 13', price: 10 })
          .set('Accept', 'application/json')
      ])

      const response = await request(server.server).get(`/items?name=Item 13`)

      expect(response.status).toBe(200)
      expect(response.body.data[0].name).toEqual('Item 13')

      const response2 = await request(server.server).get(`/items?offset=2&limit=2`)

      expect(response2.status).toBe(200)
      expect(response2.body.data.length).toBe(2)
    })

    it('Should be able to create a new item and get it by id', async () => {
      const response = await request(server.server)
        .post('/items')
        .send({ name: 'Item 2', price: 10 })
        .set('Accept', 'application/json')

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: 'Item 2',
        price: 10,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })

      const response2 = await request(server.server).get(`/items/${response.body.id}`)

      expect(response2.status).toBe(200)
      expect(response2.body).toEqual({
        id: expect.any(Number),
        name: 'Item 2',
        price: 10,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('Should be able to update an item', async () => {
      const { body: createdItem } = await request(server.server)
        .post('/items')
        .send({ name: 'Item 3', price: 10 })
        .set('Accept', 'application/json')

      expect(createdItem).toBeDefined()

      const response = await request(server.server)
        .patch(`/items/${createdItem.id}`)
        .send({ name: 'Item 1 updated', price: 20 })
        .set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: createdItem!.id,
        name: 'Item 1 updated',
        price: 20,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })

      const response2 = await request(server.server).get(`/items/${createdItem.id}`)

      expect(response2.status).toBe(200)
      expect(response2.body).toEqual({
        id: createdItem.id,
        name: 'Item 1 updated',
        price: 20,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('Should be able to delete an item', async () => {
      const { body: createdItem } = await request(server.server)
        .post('/items')
        .send({ name: 'Item 4', price: 10 })
        .set('Accept', 'application/json')

      expect(createdItem).toBeDefined()

      const response = await request(server.server).delete(`/items/${createdItem.id}`)

      expect(response.status).toBe(204)

      const response2 = await request(server.server).get(`/items/${createdItem.id}`)

      expect(response2.status).toBe(404)
    })
  })

  describe('Validations', () => {

    it('Should validate required fields', async () => {
      const response = await request(server.server)
        .post('/items')
        .send({ price: 10 })
        .set('Accept', 'application/json')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: "must have required property 'name'"
      })

      const response1 = await request(server.server)
        .post('/items')
        .send({ name: 'Item 1' })
        .set('Accept', 'application/json')

      expect(response1.status).toBe(400)
      expect(response1.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: "must have required property 'price'"
      })
    })

    it('Should not allow a value less than 0 by offset filter', async () => {
      const response = await request(server.server).get('/items?offset=-1')

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'must be >= 0'
      })
    })

    it('Should not allow a value less than 1 by limit filter', async () => {
      const response = await request(server.server).get('/items?limit=0')

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'must be >= 1'
      })
    })

    it('Should not allow for negative pricing for new items', async () => {
      const response = await request(server.server)
        .post('/items')
        .send({ name: 'Item 1', price: -10 })
        .set('Accept', 'application/json')

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'must be >= 0'
      })
    })

    it('Should not allow for negative pricing for updated items', async () => {
      const { body: createdItem } = await request(server.server)
        .post('/items')
        .send({ name: 'Item 6', price: 10 })
        .set('Accept', 'application/json')

      expect(createdItem).toBeDefined()

      const response = await request(server.server)
        .patch(`/items/${createdItem.id}`)
        .send({ name: 'Item 6 updated', price: -20 })
        .set('Accept', 'application/json')

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'must be >= 0'
      })
    })

    it('Should not allow to create an item with the same name', async () => {
      const { body: createdItem } = await request(server.server)
        .post('/items')
        .send({ name: 'Item 7', price: 10 })
        .set('Accept', 'application/json')

      expect(createdItem).toBeDefined()

      const response = await request(server.server)
        .post('/items')
        .send({ name: createdItem.name, price: 10 })
        .set('Accept', 'application/json')

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'The item with this name already exists'
      })
    })

    it('Should not allow to update the name by existing item with the same name', async () => {
      const { body: createdItem } = await request(server.server)
        .post('/items')
        .send({ name: 'Item 8', price: 10 })
        .set('Accept', 'application/json')

      expect(createdItem).toBeDefined()

      const response = await request(server.server)
        .patch(`/items/${createdItem.id}`)
        .send({ name: createdItem.name, price: 20 })
        .set('Accept', 'application/json')

      expect(response.statusCode).toBe(422)
      expect(response.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'The item with this name already exists'
      })
    })
  })

  afterAll(async () => {
    await server?.close()
    await sequelize?.close()
  })
})
