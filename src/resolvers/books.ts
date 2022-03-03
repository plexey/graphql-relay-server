import { ConnectionArguments, cursorToOffset } from "graphql-relay";
import { selectBooks } from "../sql/select";
import { connectionFromArray } from "../utils";

export default async function booksResolver(
  _source: any,
  args: ConnectionArguments
) {
  const { first, last, after, before } = args;
  if (first) {
    const rows = await selectBooks({
      offset: after ? cursorToOffset(after) : 0,
      limit: first + 1,
      order: "asc",
    });

    return connectionFromArray(rows, args);
  } else if (last) {
    const rows = await selectBooks({
      offset: before ? cursorToOffset(before) : 0,
      limit: last + 1,
      order: "desc",
    });

    return connectionFromArray(rows, args);
  }
}
