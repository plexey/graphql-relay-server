# GraphQL Relay Server

This project features a demonstrative implementation of a Relay GraphQL server running on an Express server.

The GraphQL schema models a book store with the underlying data resolved from a PostgreSQL database.

# Setup

This project consists of the following stack:

- Relay GraphQL server
- Express Server
- PostgreSQL database

To run this project and begin querying the schema we'll first need to setup the database and then spin up the Express server.

This project relies on a PostgreSQL database running via Docker to store data.

Le

[https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

With Docker installed,  install the postgres Docker image with this command:

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
  --name athenaeum \
  -p 5432:5432 \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=athenaeum \
  postgres
```

This command spins up a new postgres Docker image with a few pre-configured environment variables.

Now that the postgres Docker container is up and running, let's populate it with some data by running the following command:

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

With the db tables created, let's populate them with some data with the following script:

```bash
npm run db:populate-tables
```

This script will generate and insert some mock data into each table.

Now that the postgres database is setup and populated with some data, we can start traversing this data via the Relay GraphQL API provided by this project.

To run the GraphQL API, run the following script:

```bash
npm run start
```

This script spins up an Express server exposing three REST endpoints:
- `/register` - endpoint to register new user account
- `/login` - endpoint to login as particular user
- `/graphql` - endpoint to send GraphQL queries to

To use the `/graphql` endpoint we first need to login to the system as a particular user as the `/graphql` endpoint expects a [JWT](https://jwt.io/) token to be passed along with every request. 

We can obtain a JWT by making a POST request to the `/login` endpoint, but first we'll need to register a new user account via the `/register` endpoint.

### `/register`

The `/register` endpoint is used to register a new user account.

Method: `POST`

Expected HTTP headers:

| Content-Type  | `'application/json'`       |
|---------------|----------------------------|

Expected arguments:

| **Field**         | **Type** | **Required**   |
|-------------------|----------|----------------|
| `email`           | `string` | `true`         |
| `firstName`       | `string` | `true`         |
| `lastName`        | `string` | `true`         |
| `password`        | `string` | `true`         |
| `confirmPassword` | `string` | `true`         |

Once a new user account has been created via `/register`, we can then login as that user via the `/login` endpoint.

### `/login`

The `/login` endpoint is used to login with a set of user credentials and responds with a JWT on success.

Method: `POST`

Expected HTTP headers:

| Content-Type  | `'application/json'`       |
|---------------|----------------------------|

Expected Arguments:

| **Field**      | **Type**     | **Required** |
|------------|----------|----------|
| `email`    | `string` | `true`   |
| `password` | `string` | `true`   |


Once a JWT has been obtained via the `/login` endpoint, the JWT can be passed along as an HTTP Authorization header on `/graphql` requests.

### `/graphql` 

The `/graphql` endpoint accepts GraphQL requests. 

Method: `POST`

Expected HTTP Headers:

| Content-Type  | `'application/json'`       |
|---------------|----------------------------|
| Authorization | `'Bearer xxx.xxx.xxx'`     |

The JWT token we obtained earlier must be included in requests to `/graphql` as an Authorization HTTP header.

Now we're in business!






