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
    hello: {
      handler: "functions/handler.hello",
      environment: {
        ddb_table: { Ref: "DdbTable" },
      },
      events: [
        {
          httpApi: {
            path: "/",
            method: "get",
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
        },
      },
    },
  },
};

export default serverlessConfig;
