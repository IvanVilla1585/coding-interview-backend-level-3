import { Sequelize, Dialect } from 'sequelize'

let sequelize: Sequelize | null = null

if (!sequelize) {
  // if (process.env.NODE_ENV === 'test') {
  //   sequelize = new Sequelize({
  //     dialect: 'sqlite' as Dialect,
  //     storage: ':memory:'
  //   })
  // } else {
  //   sequelize = new Sequelize(
  //     process.env.DB_URI!,
  //     {
  //       dialect: 'postgres' as Dialect
  //     }
  //   )
  // }
  let dbUri = process.env.DB_URI

  if (process.env.NODE_ENV === 'test') {
    dbUri = process.env.DB_URI_TEST
  }

  sequelize = new Sequelize(
    dbUri!,
    {
      dialect: 'postgres' as Dialect,
      logging: false
    }
  )

  sequelize?.authenticate()
    .catch((err) => console.error(`Error connecting to database: ${err.stack}`))
}

export default sequelize
