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
  connectionFromArray,
} from "graphql-relay";
import { fetchResource } from "./utils";
import { authors, genres } from "./mock_data";
import {
  selectBookPlusMetaData,
  selectBooksByGenre,
  selectBooksPlusMetaData,
} from "./sql/select";

import DataLoader from "dataloader"

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    console.log({ globalId });
    const { type, id } = fromGlobalId(globalId);

    if (type !== "Book") {
      const data = await fetchResource(type, id);
      if (!data) return null;
      return { type, ...data };
    }

    const book = await selectBookPlusMetaData(id);
    console.log({ book });
    if (!book) return null;
    
    return { type, ...book };
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
      resolve(source: any) {
        return {
          id: source.id,
          first_name: source.first_name,
          last_name: source.last_name,
        };
      },
    },
    genre: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (source: any) => {
        return source.category;
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

const genreType = new GraphQLObjectType({
  name: "Genre",
  fields: () => ({
    id: globalIdField("Genre"),
    category: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: BookConnection,
      args: connectionArgs,
      resolve: async ({ id: genre_id }, args) => {
        const books = await selectBooksByGenre(genre_id);
        return connectionFromArray(books, args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "rootQueryType",
    description: "query root",
    fields: {
      authors: {
        type: new GraphQLList(authorType),
        resolve() {
          return authors;
        },
      },
      books: {
        type: BookConnection,
        args: connectionArgs,
        resolve: async (_source, args: any) => {
          const books = await selectBooksPlusMetaData();
          return connectionFromArray(books, args);
        },
      },
      genres: {
        type: new GraphQLList(genreType),
        resolve() {
          return genres;
        },
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
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
