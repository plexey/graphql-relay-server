# GraphQL Relay Server

This is a demo API featuring a Relay GraphQL server

## Overview

This project features a Relay GraphQL API running in an Express server. 

The GraphQL schema models a book store with the underlying book store data being resolved from a PostgreSQL database.

# Setup

To run this project, you'll first need to install Docker so you can run the postgres Docker container:

[https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

With Docker installed you can now install the postgres Docker image:

```bash
docker pull postgres
```

Once that's done, clone this project and install the dependencies with:

```bash
npm install
```

We can start a new postgres Docker from within the project by running:

```bash
npm run db:start
```

This command runs a bash script with the following contents:

```bash
sudo docker run -d \
  --name booky \
  -p 5432:5432 \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=booky \
  postgres
```

This command spins up a postgres Docker image with a few pre-configured environment variables.

Now that the postgres Docker container is up and running, let's populate it with some data by running the following command:

```bash
npm run db:create-tables
```

This will create the following empty tables in the postgres database:

- `users`
- `book_genres`
- `book_authors`
- `books`
- `authors`
- `genres`
- `book_format`
- `genre_type`

With the tables created, let's populate them with some data using the following script:

```bash
npm run db:populate-tables
```

This script will generate and insert mock data into each table.

With the postgres database now setup and ready to go, we can traverse this data via the Relay GraphQL API provided in this project.

To run the GraphQL API, run the following script:

```bash
npm run start
```

This script spins up an Express server with three REST endpoints:
- `/register` - endpoint to register new user account
- `/login` - endpoint to login as particular user
- `/graphql` - endpoint to send GraphQL queries to

To use the `/graphql` endpoint we first need to obtain a [JWT](https://jwt.io/) - the Express server expects a JWT to be passed along in each request to `/graphql`.

To obtain this JWT we can create a new user account via the `/register` endpoint. To do this, jump into your preferred REST client and hit the endpoints as needed. I'm using [Insomnia](https://insomnia.rest/) these days and highly recommend it!

The `/register` endpoint expects the following fields:

| **Field**             | **Type**     | **Required** |
|-------------------|----------|----------|
| `email`           | `string` | `true`   |
| `firstName`       | `string` | `true`   |
| `lastName`        | `string` | `true`   |
| `password`        | `string` | `true`   |
| `confirmPassword` | `string` | `true`   |

Once you've successfully created a new user account, you can then login as that user via the `/login` endpoint.

The `/login` endpoint expects the following fields:

| **Field**      | **Type**     | **Required** |
|------------|----------|----------|
| `email`    | `string` | `true`   |
| `password` | `string` | `true`   |


The `/login` endpoint will respond with a JWT on a successful login. Grab this token and pass it along as an HTTP Authorization header. For example, the header would follow this pattern:

| **key**       | **value**                |
|---------------|--------------------------|
| Authorization | Bearer `INSERT_JWT_HERE` |

Now that we've setup the JWT authorization header, we can send along a GraphQL request to the `/graphql` endpoint to begin traversing the schema.







