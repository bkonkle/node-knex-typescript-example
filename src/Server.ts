import bodyParser from 'body-parser'
import chalk from 'chalk'
import express, {Express} from 'express'
import http from 'http'
import morgan from 'morgan'
import cookieSession from 'cookie-session'

import EventHandlers from './events/EventHandlers'
import UserHandlers from './users/UserHandlers'
import AddressHandlers from './addresses/AddressHandlers'
import {DataProvider} from './data'
import {promise} from './Middleware'
import {Server} from './Config'
import {SessionData} from './Types'

declare module 'express' {
  interface Request {
    session?: SessionData,
  }
}

export async function create () {
  const app = express()
  const data = await DataProvider.create()

  app
    .disable('x-powered-by')
    .use(morgan(Server.isDev ? 'dev' : 'combined'))
    .use(bodyParser.json())
    .use(cookieSession({
      name: 'session',
      keys: ['pkdsM?o36UPYjuNx', 'QnwWwTnNiGd2M3>o', 'ikmUPhQcD78QTN;i'],

      // Cookie Options
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }))

    .post('/users/create', promise(async req => (await UserHandlers.create(data)).create(req)))
    .get('/user/current', promise(async req => (await UserHandlers.create(data)).getCurrent(req)))

    .post('/addresses/create', promise(async req => (await AddressHandlers.create(data)).create(req)))
    .get('/address/:id', promise(async req => (await AddressHandlers.create(data)).get(req)))

    .get('/events', promise(async () => (await EventHandlers.create(data)).getList()))
    .get('/events/:user', promise(async req => (await EventHandlers.create(data)).getList(req)))
    .get('/event/:id', promise(async req => (await EventHandlers.create(data)).get(req)))

  return app
}

export async function main () {
  let app = await create()

  const server = http.createServer(app)

  server.listen(Server.port, (err?: Error) => {
    if (err) {
      console.error(err)

      return
    }
    console.log(chalk.cyan(`> Started API on port ${chalk.yellow(Server.port.toString())}`))
  })

  // Support hot-swapping
  function replaceApp (newApp: Express) {
    server.removeListener('request', app)
    server.on('request', newApp)
    app = newApp
  }

  return replaceApp
}

export default {create, main}
