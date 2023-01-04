import { ConnectionArguments, cursorToOffset } from "graphql-relay";
import { selectGenres } from "../sql/select";
import { connectionFromArray, DEFAULT_LIMIT } from "../utils";

export default async function genresResolver(
  _source: any,
  args: ConnectionArguments
) {
  const { first, last, after, before } = args;

  if (last) {
    const rows = await selectGenres({
      offset: before ? cursorToOffset(before) : 0,
      limit: last ?? DEFAULT_LIMIT,
      order: "desc",
    });

    return connectionFromArray(rows, args);
  }

  const rows = await selectGenres({
    offset: after ? cursorToOffset(after) : 0,
    limit: first ?? DEFAULT_LIMIT,
    order: "asc",
  });

  return connectionFromArray(rows, args);
}
