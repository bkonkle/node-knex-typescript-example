import {Request} from 'express'

import AddressController, {Controller} from './AddressController'
import {CreateInput} from './AddressData'
import {DataClient} from '../data'

export const getAddress = (addresses: Controller) => async (req: Request) => {
  const id: string | undefined = req.params.id
  if (!id) throw new Error('An event id is required.')

  return addresses.get({id})
}

export const createAddress = (addresses: Controller) => async (req: Request) => {
  const address: CreateInput | undefined = req.params.address
  if (!address) throw new Error('Address input is required')

  return addresses.create(address)
}

export async function create (data: DataClient) {
  const addresses = await AddressController.create(data)

  return {
    get: getAddress(addresses),
    create: createAddress(addresses),
  }
}

export default {create}
