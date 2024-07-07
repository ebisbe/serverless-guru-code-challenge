import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
const client = new DynamoDBClient();

const { ddb_table } = process.env;

const MySchema = {
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  params: {
    typeField: "__typename",
    isoDates: true,
    separator: "#",
    timestamps: true,
    createdField: "createdAt",
    updatedField: "updatedAt",
  },
  models: {
    List: {
      pk: { type: String, value: "USER#${userId}" },
      sk: { type: String, value: "LIST#${id}" },
      id: { type: String, generate: "ulid" },
      userId: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      totalValue: { type: Number, default: 0 },
      totalItems: { type: Number, default: 0 },
      createdAt: { type: String },
      updatedAt: { type: String },
    },
    Item: {
      pk: { type: String, value: "LIST#${listId}" },
      sk: { type: String, value: "ITEM#${id}" },
      listId: { type: String },
      id: { type: String, generate: "ulid" },
      name: { type: String },
      description: { type: String },
      value: { type: Number, default: 0 },
      createdAt: { type: String },
      updatedAt: { type: String },
    },
    Buyer: {
      pk: { type: String, value: "ITEM#${itemId}" },
      sk: { type: String, value: "BUYER#${userId}" },
      userId: { type: String, required: true },
      name: { type: String, required: true },
      itemId: { type: String, required: true },
      createdAt: { type: String },
      updatedAt: { type: String },
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

export type Buyer = Entity<typeof MySchema.models.Buyer>;
export const Buyer = table.getModel("Buyer");
