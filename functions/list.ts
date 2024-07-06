import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";

export const create: Handler<APIGatewayProxyEventV2> = async (event) => {
  console.log("event", event.body, event.pathParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

export const get: Handler<APIGatewayProxyEventV2> = async (event) => {
  console.log("event", event.body, event.pathParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

export const update: Handler<APIGatewayProxyEventV2> = async (event) => {
  console.log("event", event.body, event.pathParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

export const remove: Handler<APIGatewayProxyEventV2> = async (event) => {
  console.log("event", event.body, event.pathParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};
