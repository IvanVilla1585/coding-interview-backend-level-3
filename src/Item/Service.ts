import * as Boom from '@hapi/boom'

import ItemRepository from './Repository.js'

// types
import IBaseService from '../interfaces/IBaseService'
import { Item, ItemFilters, ItemInput, ItemResponse } from '../interfaces/entities/Item'

class Service implements IBaseService<Item, ItemFilters, ItemInput, ItemResponse> {
  private Repository: typeof ItemRepository

  constructor (Repository: typeof ItemRepository) {
    this.Repository = Repository
  }

  async find (params: ItemFilters): Promise<ItemResponse> {
    const { rows, count } = await this.Repository.findByFilters(params)

    return {
      data: rows,
      total: count
    }
  }

  async findById (id: number): Promise<Item> {
    const item = await this.Repository.findByPk(id)

    if (!item) {
      throw Boom.notFound("The item with this id does'n exist")
    }

    return item
  }

  async create (data: ItemInput): Promise<Item> {
    const item = await this.Repository.findByName(data.name)

    if (item) {
      throw Boom.badData('The item with this name already exists')
    }

    return this.Repository.create(data)
  }

  async updateById (id: number, data: ItemInput): Promise<Item> {
    const item = await this.Repository.findByPk(id)

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

  async deleteById (id: number): Promise<Item> {
    const item = await this.Repository.findByPk(id)

    if (!item) {
      throw Boom.notFound("The item with this id does'n exist")
    }

    await item.destroy()

    return item
  }
}

export default new Service(ItemRepository)
