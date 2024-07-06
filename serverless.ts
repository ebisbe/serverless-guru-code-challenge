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
};

export default serverlessConfig;
