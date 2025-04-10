import SequelizeModel from '../libs/db/models/Item.js'

// types
import { FindAndCountOptions } from 'sequelize'
import { ItemFilters } from '../interfaces/entities/Item.js'

interface RowsFilter {
  // eslint-disable-next-line no-use-before-define
  rows: ItemModel[],
  count: number
}

class ItemModel extends SequelizeModel {
  static async findByFilters ({ name, limit, offset }: ItemFilters): Promise<RowsFilter> {
    const query: FindAndCountOptions = {}

    if (name) {
      query.where = {
        name
      }
    }

    if (limit > 0) {
      query.limit = limit
    }

    if (offset >= 0) {
      query.offset = offset
    }

    return this.findAndCountAll(query)
  }

  static async findByName (name: string): Promise<ItemModel | null> {
    return this.findOne({
      where: {
        name
      }
    })
  }
}

export default ItemModel
