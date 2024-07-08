import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { z } from "zod";

import { List } from "../../models/table";
import { ValidationError } from "../../utils/validationError";

const removeHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const listSchema = z.object({
    id: z.string(),
  });

  const list = listSchema.safeParse(event.pathParameters);
  if (!list.success) {
    throw new ValidationError(400, list.error);
  }

  await List.remove({ id: list.data.id });

  return {
    statusCode: 200,
    body: null,
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(jsonBodyParser())
  .handler(removeHandler);
