import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
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

import { loaders } from "../dataLoaders";
import { fetchResource } from "../utils";

import genresResolver from "./resolvers/genres";
import booksResolver from "./resolvers/books";
import authorsResolver from "./resolvers/authors";
import viewerResolver from "./resolvers/viewer";

type Context = {
  loaders: typeof loaders;
  user_email?: string;
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
  description: "Genre of a book.",
  fields: () => ({
    id: globalIdField("Genre"),
    category: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: BookConnection,
      description: "Books associated with genre",
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
  description: "Author of a book.",
  fields: () => ({
    id: globalIdField("Author"),
    first_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "First name of author",
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Last name of author",
    },
    full_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Full name of author",
      resolve(obj) {
        return obj.first_name + " " + obj.last_name;
      },
    },
    books: {
      type: BookConnection,
      description: "Books associated with author",
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
  description: "Information on a book",
  fields: () => ({
    id: globalIdField("Book"),
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Name of the book",
    },
    format: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Format of the book, for example: paper-back or hard-back",
    },
    authors: {
      type: AuthorConnection,
      description: "Author(s) of book",
      args: connectionArgs,
      resolve: async (
        source: any,
        args: ConnectionArguments,
        context: Context
      ) => {
        const bookId = source.id;
        const bookAuthors = await context.loaders.bookAuthors.load(bookId);
        return connectionFromArray(bookAuthors, args);
      },
    },
    genres: {
      type: GenreConnection,
      description: "Genres associated with book",
      resolve: async (source: any, _args: any, context: Context) => {
        const bookId = source.id;
        const items = await context.loaders.bookGenres.load(bookId);
        return connectionFromArray(items, _args);
      },
    },
    publication_date: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Original publication date of the book",
    },
    edition: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Current edition of book",
    },
    pages: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Number of pages contained in book",
    },
    created_at: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Creation date of current resource",
    },
    language: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Language of book",
    },
  }),
  interfaces: [nodeInterface],
});

const viewerType = new GraphQLObjectType({
  name: "Viewer",
  description: "The current viewer",
  fields: () => ({
    id: globalIdField("Viewer"),
    first_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "First name of current user",
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Last name of current user",
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Email address of current user",
    },
    created_at: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Creation date of current user",
    },
  }),
});

const { connectionType: BookConnection } = connectionDefinitions({
  name: "Book",
  nodeType: bookType,
});

const { connectionType: GenreConnection } = connectionDefinitions({
  name: "Genre",
  nodeType: genreType,
});

const { connectionType: AuthorConnection } = connectionDefinitions({
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
        description: "All authors",
        args: connectionArgs,
        resolve: authorsResolver,
      },
      books: {
        type: BookConnection,
        description: "All books",
        args: connectionArgs,
        resolve: booksResolver,
      },
      genres: {
        type: GenreConnection,
        description: "All genres",
        args: connectionArgs,
        resolve: genresResolver,
      },
      node: nodeField,
      viewer: {
        type: viewerType,
        description: "Current user",
        resolve: viewerResolver,
      },
    },
  }),
});

export { schema };
