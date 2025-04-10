import * as Boom from '@hapi/boom'

import Repository from './Repository.js'

// types
// import IBaseService from '../interfaces/IBaseService'
import { Item, ItemFilters, ItemInput, ItemResponse } from '../interfaces/entities/Item'

class Service {
  static async find (params: ItemFilters): Promise<ItemResponse> {
    const { rows, count } = await Repository.findByFilters(params)

    return {
      data: rows,
      total: count
    }
  }

  static async findById (id: number): Promise<Item> {
    const item = await Repository.findByPk(id)

    if (!item) {
      throw Boom.notFound("The item with this id does'n exist")
    }

    return item
  }

  static async create (data: ItemInput): Promise<Item> {
    const item = await Repository.findByName(data.name)

    if (item) {
      throw Boom.badData('The item with this name already exists')
    }

    return Repository.create(data)
  }

  static async updateById (id: number, data: ItemInput): Promise<Item> {
    const item = await Repository.findByPk(id)

    if (!item) {
      throw Boom.notFound("The item with this id does'n exist")
    }

    if (item.get('name') === data.name) {
      throw Boom.badData('The item with this name already exists')
    }

    item.set(data)

    await item.save()

    const response: Item = item.toJSON()

    return response
  }

  static async deleteById (id: number): Promise<Item> {
    const item = await Repository.findByPk(id)

    if (!item) {
      throw Boom.notFound("The item with this id does'n exist")
    }

    await item.destroy()

    return item
  }
}

export default Service
