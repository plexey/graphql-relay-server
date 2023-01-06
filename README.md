# GraphQL Relay Server

The project contains an API for a fake book store called Athenaeum.

It showcases a GraphQL API compliant with the Relay GraphQL server spec.

## Table of Contents

- [Project Stack](#stack)
- [Project Features](#features)
- [Project Setup](#setup)
- [GraphQL API](#graphql-api)
- [Endpoints](#endpoints)

<a name="stack"></a>

## Project Stack

- GraphQL API
- Express API
- PostgreSQL
- Docker

<a name="features"></a>

## Features

- Relay GraphQL API featuring:
  - Global Object Identification
    - Node interface
    - Node root field
  - Cursor Connections
  - Dataloaders
- Authentication via salted hashed password
- Authorization via signed JWT
- Database data mocking with Faker

<a name="setup"></a>

## Setup

Setting up this project involves the following:

- [Install Docker](#install-docker)
- [Pull PostgreSQL Docker Image](#pull-postgresql-docker-image)
- [Setup Database](#setup-database)
- [Start Express server](#start-express-server)
- [Register User](#register-user)
- [Login User](#login-user)

<a name="install-docker"></a>

## Install Docker

The data for the GraphQL API in this project is resolved from a PostgreSQL database running as a Docker container.

If you don't already have Docker installed, you can download Docker using the link below:

[https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

<a name="pull-postgresql-docker-image"></a>

## Pull PostgreSQL Docker Image

With Docker installed, let's pull down the PostgreSQL Docker image with this command:

```bash
docker pull postgres
```

Now we can use this image to spin up a PostgreSQL Docker container.

<a name="setup-database"></a>

## Setup Database

Before we spin up a new postgres Docker container, let's first clone this project and then install its dependencies with:

```bash
npm install
```

With the project cloned and it's dependencies installed we'll next create a new `.env` file in the project root with the following contents:

```bash
POSTGRES_USER=root
POSTGRES_PASSWORD=example_password
POSTGRES_DB=athenaeum
HMAC_SECRET_KEY=abcd1234
```

The project includes a `.env-example` file which can be used as a reference. 

The environment variables contained in the `.env` file will be used to provision a new postgres Docker container among other uses.

Now we can proceed with setting up the database - let's run the following command to do this:

```bash
npm run db:setup
```

This command does three things:

1. Spins up a postgres database inside a Docker container
2. Inserts tables into the postgres database
3. Populates database tables with some mock data

After running the above command, we should have a running database with the following tables:

- `users`
- `books`
- `authors`
- `genres`
- `book_authors`
- `book_genres`
- `book_format`
- `genre_type`

We can verify this in a number of ways - personally I prefer to jump into a PostgreSQL GUI such as [https://www.pgadmin.org/](https://www.pgadmin.org/) to inspect the database.

### Start Express Server

Now that the postgres database is setup, we can spin up the Express server provided by this project.

This can be done via the following command:

```bash
npm run start
```

This will spin up an Express server exposing three REST endpoints:

- `/register` - endpoint to register new user account
- `/login` - endpoint to login as particular user
- `/graphql` - endpoint to send GraphQL queries to

<a name="register-user"></a>

### Register User

To use the `/graphql` endpoint we first need to register as a new user and then login as that user.

See the [register](#register) endpoint documentation for more details.

Once a new user account has been registered, we can proceed to login as that user.

<a name="login-user"></a>

### Login User

The `/login` endpoint is used to login with a set of user credentials and responds with a [JSON Web Token](https://jwt.io/), or JWT for short.

See the [login](#login) endpoint documentation for more details.

Once a JWT has been obtained via the `/login` endpoint, we can proceed to query the GraphQL API endpoint `/graphql`.

<a name="graphql-api"></a>

## GraphQL API

This project ships with GraphiQL allowing you to write and execute queries via a web interface.

If the Express server is up, we can head over to `http://localhost:4000/graphql` to start querying the GraphQL API.

To use the GraphiQL interface, we'll need to create a new cookie in the browser called `Authorization` with the value of the JWT we acquired by logging in.

<a name="Endpoints"></a>

## Endpoints

<a name="register"></a>

### register

The `/register` endpoint is used to register a new user account.

Method: `POST`

Expected HTTP headers:

| Content-Type | `'application/json'` |
| ------------ | -------------------- |

Expected arguments:

| **Field**         | **Type** | **Required** |
| ----------------- | -------- | ------------ |
| `email`           | `string` | `true`       |
| `firstName`       | `string` | `true`       |
| `lastName`        | `string` | `true`       |
| `password`        | `string` | `true`       |
| `confirmPassword` | `string` | `true`       |

<a name="login"></a>

### login

The `/login` endpoint is used to login with a set of user credentials and responds with a [JSON Web Token](https://jwt.io/), abbreviated to JWT.

Method: `POST`

Expected HTTP headers:

| Content-Type | `'application/json'` |
| ------------ | -------------------- |

Expected Arguments:

| **Field**  | **Type** | **Required** |
| ---------- | -------- | ------------ |
| `email`    | `string` | `true`       |
| `password` | `string` | `true`       |

<a name="graphql"></a>

### graphql

The `/graphql` endpoint accepts GraphQL requests.

Method: `POST`

HTTP Headers:

| Content-Type  | `'application/json'`   |
| ------------- | ---------------------- |
| Authorization | `'Bearer xxx.xxx.xxx'` |
