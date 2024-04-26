export type Method =
  | "collections"
  | "getRecords"
  | "getColumns"
  | "addNewRecord"
  | "getCount"
  | "deleteCollection";
export type MethodAck = `ack:${Method}`;

export type Column = {
  name: string;
  type: "number" | "string" | "boolean";
  isOptional?: boolean;
};
