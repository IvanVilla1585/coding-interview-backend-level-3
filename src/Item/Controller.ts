import BaseController from '../commonClasses/BaseControlles.js'
import ItemService from './Service.js'

// types
import { Item, ItemFilters, ItemInput, ItemParams, ItemResponse } from '../interfaces/entities/Item.js'

class Controller extends BaseController<Item, ItemFilters, ItemInput, ItemResponse, ItemParams, typeof ItemService> {
  constructor () {
    super(ItemService)
  }
}

export default new Controller()
