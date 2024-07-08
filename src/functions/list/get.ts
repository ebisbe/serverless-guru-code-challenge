import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { z } from "zod";

import { List } from "../../models/table";
import { ValidationError } from "../../utils/validationError";

const getListHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const listSchema = z.object({
    id: z.string(),
  });

  const list = listSchema.safeParse(event.pathParameters);
  if (!list.success) {
    throw new ValidationError(400, list.error);
  }

  const listData = await List.get({
    id: list.data.id,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(listData),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(httpJsonBodyParser())
  .handler(getListHandler);
