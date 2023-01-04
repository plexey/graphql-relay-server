import { ConnectionArguments, cursorToOffset } from "graphql-relay";
import { selectBooks } from "../sql/select";
import { connectionFromArray, DEFAULT_LIMIT } from "../utils";

export default async function booksResolver(
  _source: any,
  args: ConnectionArguments
) {
  const { first, last, after, before } = args;
  
  if (last) {
    const rows = await selectBooks({
      offset: before ? cursorToOffset(before) : 0,
      limit: last ?? DEFAULT_LIMIT,
      order: "desc",
    });

    return connectionFromArray(rows, args);
  }

  const rows = await selectBooks({
    offset: after ? cursorToOffset(after) : 0,
    limit: first ?? DEFAULT_LIMIT,
    order: "asc",
  });

  return connectionFromArray(rows, args);
}
