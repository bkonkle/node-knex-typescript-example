/* tslint:disable await-promise */
import Knex from 'knex'

import MigrationUtils from '../src/utils/MigrationUtils'
import {Database} from '../src/Config'

export async function up (knex: Knex) {
  const schema = MigrationUtils.schema(knex)

  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  await knex.raw(`CREATE SCHEMA ${Database.schema};`)

  // User
  await knex.schema.withSchema(Database.schema).createTable('User', table => {
    const columns = schema(table)
    columns.primaryUuid()

    table.timestamps(true, true)

    // Fields
    table.string('username')
      .unique()
      .comment(`The User''s login id - usually their email address.`)

    table.string('firstName')
      .comment(`The User''s first name.`)

    table.string('lastName')
      .comment(`The User''s last name.`)

    table.boolean('isActive')
      .comment(`If false, the User is suspended.`)
  })

  // Address
  await knex.schema.withSchema(Database.schema).createTable('Address', table => {
    const columns = schema(table)
    columns.primaryUuid()

    table.timestamps(true, true)

    // Fields
    table.string('line1').comment('The first line of the Address.')

    table.string('line2').comment('The second line of the Address.')

    table.string('city').comment('The city.')

    table.string('state').comment('The state or province.')

    table.string('country').comment('The country.')

    table.string('postalCode').comment('The zip or other postal code.')

    table.specificType('location', 'POINT')
      .comment('The latitude and longitude of the Address.')
  })

  // Event
  await knex.schema.withSchema(Database.schema).createTable('Event', table => {
    const columns = schema(table)
    columns.primaryUuid()

    table.timestamps(true, true)

    // Fields
    table.string('name').notNullable().comment(`The Event''s name.`)

    table.text('description').comment(`The Event''s description`)

    // Relationships
    columns
      .foreignUuid('user', {column: 'id', table: `${Database.schema}.User`}, true)
      .comment('The User that created the Event.')

    columns
      .foreignUuid('address', {column: 'id', table: `${Database.schema}.Address`})
      .comment(`The Event''s Address.`)
  })
}

export function down (_knex: Knex) {
  throw new Error('Downward migrations are not supported. Restore from backup.')
}
