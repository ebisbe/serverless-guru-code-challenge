import type { Serverless } from "serverless/aws";

const serverlessConfig: Serverless = {
  org: "skedr",
  app: "code-challenge",

  service: "code-challenge-5",
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
  },

  build: {
    esbuild: {
      bundle: true,
      minify: true,
    },
  },

  functions: {
    createList: {
      handler: "src/functions/list/create.handler",
      environment: {
        ddb_table: { Ref: "DdbTable" },
      },
      events: [
        {
          httpApi: {
            path: "/list",
            method: "post",
          },
        },
      ],
    },
    getList: {
      handler: "src/functions/list/get.handler",
      environment: {
        ddb_table: { Ref: "DdbTable" },
      },
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "get",
          },
        },
      ],
    },
    updateList: {
      handler: "src/functions/list/update.handler",
      environment: {
        ddb_table: { Ref: "DdbTable" },
      },
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "patch",
          },
        },
      ],
    },
    removeList: {
      handler: "src/functions/list/remove.handler",
      environment: {
        ddb_table: { Ref: "DdbTable" },
      },
      events: [
        {
          httpApi: {
            path: "/list/{id}",
            method: "delete",
          },
        },
      ],
    },
  },

  resources: {
    Resources: {
      DdbTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "pk",
              AttributeType: "S",
            },
            {
              AttributeName: "sk",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "pk",
              KeyType: "HASH",
            },
            {
              AttributeName: "sk",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
};

export default serverlessConfig;
