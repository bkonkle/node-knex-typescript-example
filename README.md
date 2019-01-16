# Node / Knex / TypeScript API Example

This is an Express-based application server written in TypeScript. It uses GraphQL via Apollo to communicate with the client, and also supports classic REST endpoints.

## Installation

### Dependencies

Install dependencies with [Yarn](http://yarnpkg.com):

    $ yarn

This should install the ReasonML and BuckleScript platform to compile the code to JavaScript.

### Local Database

To use Postgres locally:

    $ createuser -s api-user
    $ createdb api-example -O api-user
    $ yarn db.migrate

## Running the Application

To run in development, use a TypeScript watcher on a separate tab first:

    $ yarn build.ts.watch

Then run the server in development mode:

    $ yarn dev

## Architecture

### Express

The core of the application is an Express server with some middleware:

* [express-promise-router](https://www.npmjs.com/package/express-promise-router)
* [body-parser](https://github.com/expressjs/body-parser)
* [cors](https://github.com/expressjs/cors)
