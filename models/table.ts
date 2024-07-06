import { Entity, Table } from "dynamodb-onetable";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

const MySchema = {
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  models: {
    list: {
      pk: { type: String, value: "account#${name}" },
      name: { type: String },
    },
    item: {
      pk: { type: String },
      sk: { type: String },
    },
    buyer: {
      pk: { type: String },
      sk: { type: String },
    },
  } as const,
};

const table = new Table({
  client: client,
  name: "MyTable",
  schema: MySchema,
});

export type List = Entity<typeof MySchema.models.list>;
export const List = table.getModel("list");

export type Item = Entity<typeof MySchema.models.item>;
export const Item = table.getModel("item");

export type Buyer = Entity<typeof MySchema.models.buyer>;
export const Buyer = table.getModel("buyer");
