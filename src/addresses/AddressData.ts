/* tslint:disable await-promise */
import {QueryBuilder} from 'knex'
import {Omit} from 'ramda'

import {DataClient} from '../data'
import {Database} from '../Config'

export interface Address {
  id: string,
  line1?: string,
  line2?: string,
  city?: string,
  state?: string,
  country?: string,
  postalCode?: string,
  location?: string,
}

export interface Data {
  get: ReturnType<typeof getAddress>,
  getList: ReturnType<typeof getAddressList>,
  create: ReturnType<typeof createAddress>,
}

export interface GetInput {
  id: string,
}

export const getAddress = (addresses: () => QueryBuilder) => async (input: GetInput) => {
  return (await addresses().select().where({id: input.id}) as Address[])[0]
}

export interface GetListInput extends Omit<Address, 'id'> {}

export const getAddressList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as Address[])
}

export interface CreateInput extends Omit<Address, 'id'> {}

export const createAddress = (addresses: () => QueryBuilder) => async (input?: CreateInput) => {
  const result = (await addresses().insert(input, ['id']) as [{id: string}])[0]

  return (await addresses().select().where({id: result.id}) as Address[])[0]
}

export async function create (data: DataClient): Promise<Data> {
  const addresses = () => data.postgres.withSchema(Database.schema).table('Address')

  return {
    get: getAddress(addresses),
    getList: getAddressList(addresses),
    create: createAddress(addresses),
  }
}

export default {create}
