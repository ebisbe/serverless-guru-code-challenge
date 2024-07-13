import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";

const config = {
  maxRetries: 3,
  convertEmptyValues: true,
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local",
  }),
};
export const client = new DynamoDBClient(config);

const { ddb_table } = process.env;

const MySchema = {
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  params: {
    typeField: "__typeName",
    separator: "#",
    isoDates: true,
    timestamps: true,
    createdField: "createdAt",
    updatedField: "updatedAt",
  },
  models: {
    List: {
      pk: { type: String, value: "LIST#${id}" },
      sk: { type: String, value: "LIST#${id}" },
      id: { type: String, generate: "ulid" },
      name: { type: String, required: true },
      description: { type: String },
      totalPrice: { type: Number, default: 0 },
      totalItems: { type: Number, default: 0 },
      createdAt: { type: Date },
      updatedAt: { type: Date },
    },
    Item: {
      pk: { type: String, value: "LIST#${listId}" },
      sk: { type: String, value: "ITEM#${id}" },
      listId: { type: String },
      id: { type: String, generate: "ulid" },
      name: { type: String },
      description: { type: String },
      price: { type: Number, default: 0 },
      createdAt: { type: Date },
      updatedAt: { type: Date },
    },
  } as const,
};

const table = new Table({
  client: client,
  partial: true,
  name: ddb_table,
  schema: MySchema,
});

export type List = Entity<typeof MySchema.models.List>;
export const List = table.getModel("List");

export type Item = Entity<typeof MySchema.models.Item>;
export const Item = table.getModel("Item");
