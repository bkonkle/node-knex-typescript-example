import EventData, {Data, GetInput, GetListInput} from './EventData'
import {DataClient} from '../data'

export interface Controller {
  get: ReturnType<typeof getEvent>,
  getList: ReturnType<typeof getEventList>,
}

export const getEvent = (events: Data) => async (input: GetInput) => {
  return events.get(input)
}

export const getEventList = (events: Data) => async (input?: GetListInput) => {
  return events.getList(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const events = await EventData.create(data)

  return {
    get: getEvent(events),
    getList: getEventList(events),
  }
}

export default {create}
