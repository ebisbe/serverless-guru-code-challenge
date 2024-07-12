import resources from "./src/resources";
import { WeddingTable } from "./src/resources/ddb";
import { stepFunctions } from "./src/stepFunctions";
import { getAttribute, ServerlessExtended } from "./src/types/extendedSlsTypes";

const environment = {
  ddb_table: getAttribute(WeddingTable, "Arn"),
};

const serverlessConfig: ServerlessExtended = {
  org: "skedr",
  app: "code-challenge",

  service: "code-challenge-5",
  provider: {
    name: "aws",
    stage: "dev",
    runtime: "nodejs20.x",
    logs: {
      httpApi: {
        format: JSON.stringify({
          requestId: "$context.requestId",
          ip: "$context.identity.sourceIp",
          requestTime: "$context.requestTime",
          httpMethod: "$context.httpMethod",
          routeKey: "$context.routeKey",
          status: "$context.status",
          protocol: "$context.protocol",
          responseLength: "$context.responseLength",
          errorMessage: "$context.error.message",
          errorMessageString: "$context.error.messageString",
          errorResponseType: "$context.error.responseType",
        }),
      },
    },
  },

  build: {
    esbuild: {
      bundle: true,
      minify: true,
    },
  },

  plugins: ["serverless-iam-roles-per-function", "serverless-step-functions"],

  stepFunctions,

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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
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
          Resource: getAttribute(WeddingTable, "Arn"),
        },
      ],
    },
  },

  resources,
};

export default serverlessConfig;
