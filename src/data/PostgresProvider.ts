/* tslint:disable await-promise */
import Knex from 'knex'

import {Database} from '../Config'

/**
 * Initialize a new Postgres provider
 */
export async function create () {
  const knex = Knex({
    client: 'pg',
    connection: {
      user: Database.username,
      password: Database.password,
      host: Database.hostname,
      port: Database.port,
      database: Database.name
    },
    pool: {
      min: Database.poolMin,
      max: Database.poolMax,
      idleTimeoutMillis: Database.poolIdle
    },
    acquireConnectionTimeout: 2000
  })

  // Verify the connection before proceeding
  try {
    await knex.raw('SELECT now()')

    return knex
  } catch (error) {
    throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.')
  }
}

export default {create}
