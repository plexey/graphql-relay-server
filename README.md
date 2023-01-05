# GraphQL Relay Server

The project contains an API a fake book store called Athenaeum.

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
  - Node interface
  - dataloaders
  - cursor based pagination
- Authentication via salted hashed password
- Authorization via signed JWT
- Database data mocking with Faker

<a name="setup"></a>

## Setup

Setting up this project involves the following:

- [Install Docker](#install-docker)
- [Start Database](#start-database)
- [Add Tables](#add-tables)
- [Populate Tables](#populate-tables)
- [Start Express server](#start-express-server)
- [Register User](#register-user)
- [Login User](#login-user)

<a name="install-docker"></a>

## Install Docker

If you don't already have Docker installed, you can get Docker using the link below:

[https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

<a name="start-postgresql-database"></a>

## Start Database

With Docker installed, we can now install the postgres Docker image with this command:

```bash
docker pull postgres
```

Once that's done, clone this project then install the dependencies with:

```bash
npm install
```

Next let's create a new `.env` file in the project root with the following contents:

```
POSTGRES_USER=root
POSTGRES_PASSWORD=example_password
POSTGRES_DB=athenaeum

HMAC_SECRET_KEY=abcd1234
```

You can use the `.env-example` file as a reference point.

We can start a new postgres Docker container from within the project by running:

```bash
npm run db:init
```

This will spin up a new postgres Docker image with some pre-configured environment variables read from the `.env` file we added in the previous step.

<a name="add-tables"></a>

## Add Tables

Now that the postgres Docker container is up and running, let's add the tables we need to the database with the following command:

```bash
npm run db:create-tables
```

This will create the following empty tables in the postgres database:

- `users`
- `books`
- `authors`
- `genres`
- `book_authors`
- `book_genres`
- `book_format`
- `genre_type`

<a name="populate-tables"></a>

## Populate Tables

This project includes mocking utilities to help populate the tables with some data. These utilities can be viewed under `src/mock/dbData.ts`.

Run the following script to populate the tables with some mock data:

```bash
npm run db:populate-tables
```

<a name="start-express-server"></a>

### Start Express Server

Now that the postgres database is running with populated tables, we can spin up the Express server provided by this project.

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
