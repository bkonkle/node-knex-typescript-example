import bodyParser from 'body-parser'
import chalk from 'chalk'
import express, {Express} from 'express'
import http from 'http'
import morgan from 'morgan'

import EventHandlers from './events/EventHandlers'
import {promise} from './Middleware'
import {DataProvider} from './data'
import {Server} from './Config'

export async function create () {
  const app = express()
  const data = await DataProvider.create()

  app
    .disable('x-powered-by')
    .use(morgan(Server.isDev ? 'dev' : 'combined'))
    .use(bodyParser.json())

    .get('/events', promise(async () => (await EventHandlers.create(data)).getList()))
    .get('/events/:user', promise(async (req) => (await EventHandlers.create(data)).getList(req)))
    .get('/event/:id', promise(async (req) => (await EventHandlers.create(data)).get(req)))

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
