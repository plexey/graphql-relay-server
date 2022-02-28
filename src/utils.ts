import { pool } from "./pool";
import { selectResource } from "./sql/select";
import { ResourceType } from "./types";

export const toGlobalId = (type: ResourceType, id: string) => {
  const str = `${type}:${id}`;

  // create a buffer
  const buff = Buffer.from(str, "utf-8");

  // encode buffer as Base64
  const base64 = buff.toString("base64");

  return base64;
};

export const fromGlobalId = (
  base64: string
): { type: ResourceType; id: string } => {
  const buff = Buffer.from(base64, "base64");
  const str = buff.toString("utf-8");
  const parts = str.split(":");
  const resourceType = parts[0] as ResourceType;
  const resourceId = parts[1];

  return { type: resourceType, id: resourceId };
};

const resourceTypeToTableName = (
  type: ResourceType
): "books" | "authors" | "genres" => {
  switch (type) {
    case "Author":
      return "authors";
    case "Book":
      return "books";
    case "Genre":
      return "genres";
  }
};

export const fetchResource = async (type: string, id: string) => {
  const tableName = resourceTypeToTableName(type as ResourceType);
  const result = await selectResource(tableName, id);
  return result;
};
