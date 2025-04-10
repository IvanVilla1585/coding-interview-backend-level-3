import { DataTypes, Model } from 'sequelize'

import sequelize from '../index.js'

// types
import { ItemAttributes } from '../../../interfaces/entities/Item.js'

class ItemModel extends Model<ItemAttributes> {
  public id!: number
  public name!: string
  public price!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  },
  {
    sequelize: sequelize!,
    tableName: 'items'
  }
)

export default ItemModel
