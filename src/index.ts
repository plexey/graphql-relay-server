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
} from "graphql-relay";
import { fetchResource } from "./utils";
import {
  authorsLoader,
  booksByAuthorLoader,
  booksByGenreLoader,
  booksLoader,
  genresLoader,
} from "./dataloaders";
import authorsResolver from "./resolvers/authors";
import booksResolver from "./resolvers/books";
import genresResolver from "./resolvers/genres";

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

const bookGenreType = new GraphQLObjectType({
  name: "BookGenre",
  fields: () => ({
    id: globalIdField("Genre"),
    category: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  }),
  interfaces: [nodeInterface],
});

const genreType = new GraphQLObjectType({
  name: "Genre",
  fields: () => ({
    id: globalIdField("Genre"),
    category: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(bookType),
      resolve(source: any, _args: any, context: any) {
        return context.loaders.booksByGenreLoader.load(source.id);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const authorBookType = new GraphQLObjectType({
  name: "AuthorBook",
  fields: {
    id: globalIdField("Book"),
    title: { type: new GraphQLNonNull(GraphQLString) },
    format: { type: new GraphQLNonNull(GraphQLString) },
    publication_date: { type: new GraphQLNonNull(GraphQLString) },
    edition: { type: new GraphQLNonNull(GraphQLInt) },
    pages: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
    genre: {
      type: bookGenreType,
      resolve(source: any, _args: any, context: any) {
        return context.loaders.genresLoader.load(source.genre_id);
      },
    },
  },
  interfaces: [nodeInterface],
});

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: {
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
      type: new GraphQLList(authorBookType),
      resolve(source: any, _args: any, context: any) {
        return context.loaders.booksByAuthorLoader.load(source.id);
      },
    },
  },
  interfaces: [nodeInterface],
});

const bookType = new GraphQLObjectType({
  name: "Book",
  fields: {
    id: globalIdField("Book"),
    title: { type: new GraphQLNonNull(GraphQLString) },
    format: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: authorType,
      resolve(source: any, _args: any, context: any) {
        return context.loaders.authorsLoader.load(source.author_id);
      },
    },
    genre: {
      type: bookGenreType,
      resolve(source: any, _args: any, context: any) {
        return context.loaders.genresLoader.load(source.genre_id);
      },
    },
    publication_date: { type: new GraphQLNonNull(GraphQLString) },
    edition: { type: new GraphQLNonNull(GraphQLInt) },
    pages: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    languages: { type: new GraphQLNonNull(GraphQLString) },
  },
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
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
    context: {
      loaders: {
        booksLoader,
        authorsLoader,
        genresLoader,
        booksByGenreLoader,
        booksByAuthorLoader: booksByAuthorLoader,
      },
    },
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
