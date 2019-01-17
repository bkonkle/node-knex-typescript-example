/* tslint:disable await-promise */
import {QueryBuilder} from 'knex'
import {Omit} from 'ramda'

import {DataClient} from '../data'
import {Database} from '../Config'

export interface User {
  id: string,
  username: string,
  firstName?: string,
  lastName?: string,
  isActive: boolean,
}

export interface Data {
  get: ReturnType<typeof getUser>,
  getList: ReturnType<typeof getUserList>,
  create: ReturnType<typeof createUser>,
}

export interface GetInput {
  id: string,
}

export const getUser = (users: () => QueryBuilder) => async (input: GetInput) => {
  return (await users().select().where({id: input.id}) as User[])[0]
}

export interface GetListInput extends Omit<User, 'id'> {}

export const getUserList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as User[])
}

export interface CreateInput extends Omit<User, 'id'> {}

export const createUser = (users: () => QueryBuilder) => async (input?: CreateInput) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as User[])[0]
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.postgres.withSchema(Database.schema).table('User')

  return {
    get: getUser(users),
    getList: getUserList(users),
    create: createUser(users),
  }
}

export default {create}
