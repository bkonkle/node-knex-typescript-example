import {Request} from 'express'

import {DataClient} from '../data'
import EventController, {Controller} from './EventController'

export const getEvent = (events: Controller) => async (req: Request) => {
  const id: string | undefined = req.params.id
  if (!id) throw new Error('An event id is required.')

  return events.get({id})
}

export const getEventList = (events: Controller) => async (req?: Request) => {
  const user: string | undefined = req && req.params.user

  return events.getList(user ? {user} : undefined)
}

export async function create (data: DataClient) {
  const events = await EventController.create(data)

  return {
    get: getEvent(events),
    getList: getEventList(events),
  }
}

export default {create}
