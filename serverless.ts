import resources from "./src/resources";
import { WeddingTable } from "./src/resources/ddb";
import { getRef, ServerlessExtended } from "./src/types/extendedSlsTypes";

const environment = {
  ddb_table: getRef(WeddingTable),
};

const serverlessConfig: ServerlessExtended = {
  org: "skedr",
  app: "code-challenge",

  service: "code-challenge-5",
  provider: {
    name: "aws",
    stage: "dev",
    runtime: "nodejs20.x",
  },

  build: {
    esbuild: {
      bundle: true,
      minify: true,
    },
  },

  plugins: ["serverless-iam-roles-per-function"],

  functions: {
    createList: {
      handler: "src/functions/list/create.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list",
            method: "post",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:PutItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    getList: {
      handler: "src/functions/list/get.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "get",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:GetItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    updateList: {
      handler: "src/functions/list/update.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "patch",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:UpdateItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    removeList: {
      handler: "src/functions/list/remove.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "delete",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:DeleteItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    createItem: {
      handler: "src/functions/item/create.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{listId}/item",
            method: "post",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:PutItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    getItem: {
      handler: "src/functions/item/get.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{listId}/item/{id}",
            method: "get",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:GetItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    updateItem: {
      handler: "src/functions/item/update.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{listId}/item/{id}",
            method: "patch",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:UpdateItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
    removeItem: {
      handler: "src/functions/item/remove.handler",
      environment,
      events: [
        {
          httpApi: {
            path: "/list/{listId}/item/{id}",
            method: "delete",
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:DeleteItem"],
          Resource: getRef(WeddingTable),
        },
      ],
    },
  },

  resources,
};

export default serverlessConfig;
