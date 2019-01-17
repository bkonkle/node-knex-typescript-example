import UserData, {Data, GetInput, GetListInput, CreateInput} from './UserData'
import {DataClient} from '../data'

export interface Controller {
  get: ReturnType<typeof getUser>,
  getList: ReturnType<typeof getUserList>,
  create: ReturnType<typeof createUser>,
}

export const getUser = (users: Data) => async (input: GetInput) => {
  return users.get(input)
}

export const getUserList = (users: Data) => async (input?: GetListInput) => {
  return users.getList(input)
}

export const createUser = (users: Data) => async (input?: CreateInput) => {
  return users.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const users = await UserData.create(data)

  return {
    get: getUser(users),
    getList: getUserList(users),
    create: createUser(users),
  }
}

export default {create}
