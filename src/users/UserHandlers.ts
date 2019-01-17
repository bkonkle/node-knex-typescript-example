import {Request} from 'express'

import {DataClient} from '../data'
import UserController, {Controller} from './UserController'

export const getCurrentUser = (users: Controller) => async (req: Request) => {
  const id = req.session && req.session.userId

  return id && users.get({id})
}

export const createUser = (users: Controller) => async (req: Request) => {
  const user = await users.create()

  if (!req.session) req.session = {}
  req.session.userId = user.id

  return user
}

export async function create (data: DataClient) {
  const users = await UserController.create(data)

  return {
    getCurrent: getCurrentUser(users),
    create: createUser(users),
  }
}

export default {create}
