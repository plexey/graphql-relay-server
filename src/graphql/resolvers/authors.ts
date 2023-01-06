import { ConnectionArguments, cursorToOffset } from "graphql-relay";
import { selectAuthors } from "../../sql/select";
import { connectionFromArray, DEFAULT_LIMIT } from "../../utils";

export default async function authorsResolver(
  _source: any,
  args: ConnectionArguments
) {
  const { first, last, after, before } = args;

  if (last) {
    const rows = await selectAuthors({
      offset: before ? cursorToOffset(before) : 0,
      limit: last + 1,
      order: "desc",
    });

    return connectionFromArray(rows, args);
  }

  const rows = await selectAuthors({
    offset: after ? cursorToOffset(after) : 0,
    limit: first ? first + 1 : DEFAULT_LIMIT + 1,
    order: "asc",
  });

  return connectionFromArray(rows, args);
}
