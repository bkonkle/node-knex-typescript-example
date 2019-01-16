import Knex from 'knex'
import {Redis} from 'ioredis'

import PostgresProvider from './PostgresProvider'
import RedisProvider from './RedisProvider'

export interface DataClient {
  postgres: Knex,
  redis: Redis,
}

export async function create (): Promise<DataClient> {
  return {
    postgres: await PostgresProvider.create(),
    redis: await RedisProvider.create(),
  }
}

export default {create}
