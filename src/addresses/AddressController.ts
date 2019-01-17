import AddressData, {Data, GetInput, GetListInput, CreateInput} from './AddressData'
import {DataClient} from '../data'

export interface Controller {
  get: ReturnType<typeof getAddress>,
  getList: ReturnType<typeof getAddressList>,
  create: ReturnType<typeof createAddress>,
}

export const getAddress = (addresses: Data) => async (input: GetInput) => {
  return addresses.get(input)
}

export const getAddressList = (addresses: Data) => async (input?: GetListInput) => {
  return addresses.getList(input)
}

export const createAddress = (addresses: Data) => async (input?: CreateInput) => {
  return addresses.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const addresses = await AddressData.create(data)

  return {
    get: getAddress(addresses),
    getList: getAddressList(addresses),
    create: createAddress(addresses),
  }
}

export default {create}
