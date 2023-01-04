import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  ConnectionArguments,
  connectionFromArray,
} from "graphql-relay";
import { fetchResource } from "./utils";
import { loaders } from "./dataloaders";
import authorsResolver from "./resolvers/authors";
import booksResolver from "./resolvers/books";
import genresResolver from "./resolvers/genres";
import bodyParser from "body-parser";
import { login, register } from "./routes";
import { authenticateJWT, verifyJWT } from "./security";
import cookieParser from "cookie-parser";

type Context = {
  loaders: typeof loaders;
};

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    const data = await fetchResource(type, id);
    if (!data) return null;

    return { type, ...data };
  },
  (obj: any): any => {
    switch (obj.type) {
      case "Author":
        return authorType;
      case "Book":
        return bookType;
      case "Genre":
        return genreType;
      default:
        return null;
    }
  }
);

const genreType = new GraphQLObjectType({
  name: "Genre",
  fields: () => ({
    id: globalIdField("Genre"),
    category: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: BookConnection,
      resolve: async (source: any, args: any, context: Context) => {
        const genreId = source.id;
        const data = await context.loaders.genreBooks.load(genreId);
        return connectionFromArray(data, args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: globalIdField("Author"),
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    full_name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(obj) {
        return obj.first_name + " " + obj.last_name;
      },
    },
    books: {
      type: BookConnection,
      resolve: async (source: any, _args: any, context: any) => {
        const items = await context.loaders.authorBooks.load(source.id);
        return connectionFromArray(items, _args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const bookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: globalIdField("Book"),
    title: { type: new GraphQLNonNull(GraphQLString) },
    format: { type: new GraphQLNonNull(GraphQLString) },
    authors: {
      type: AuthorConnection,
      args: connectionArgs,
      resolve: async (
        source: any,
        args: ConnectionArguments,
        context: Context
      ) => {
        const bookId = source.id;
        const bookAuthors = await context.loaders.bookAuthors.load(bookId);
        return connectionFromArray(bookAuthors, args)
      },
    },
    genres: {
      type: GenreConnection,
      resolve: async (source: any, _args: any, context: Context) => {
        const bookId = source.id
        const items = await context.loaders.bookGenres.load(bookId)
        return connectionFromArray(items, _args);
      },
    },
    publication_date: { type: new GraphQLNonNull(GraphQLString) },
    edition: { type: new GraphQLNonNull(GraphQLInt) },
    pages: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
  }),
  interfaces: [nodeInterface],
});

var { connectionType: BookConnection } = connectionDefinitions({
  name: "Book",
  nodeType: bookType,
});

var { connectionType: GenreConnection } = connectionDefinitions({
  name: "Genre",
  nodeType: genreType,
});

var { connectionType: AuthorConnection } = connectionDefinitions({
  name: "Author",
  nodeType: authorType,
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "rootQueryType",
    description: "query root",
    fields: {
      authors: {
        type: AuthorConnection,
        args: connectionArgs,
        resolve: authorsResolver,
      },
      books: {
        type: BookConnection,
        args: connectionArgs,
        resolve: booksResolver,
      },
      genres: {
        type: GenreConnection,
        args: connectionArgs,
        resolve: genresResolver,
      },
      node: nodeField,
    },
  }),
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());

app.get("/register", register);
app.get("/login", login);

app.use(
  "/graphql",
  authenticateJWT,
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
    context: {
      loaders: loaders,
    },
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
