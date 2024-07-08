import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { z } from "zod";

import { List } from "../../models/table";
import { ValidationError } from "../../utils/validationError";

const updateHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const listSchema = z.object({
    name: z.string(),
    description: z.string(),
  }) satisfies z.ZodType<List>;

  const list = listSchema.safeParse(event.body);
  if (!list.success) {
    throw new ValidationError(400, list.error);
  }

  const updateListRaw = {
    id: event.pathParameters?.id,
    ...list.data,
  };
  const updatedList = await List.update(updateListRaw);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedList),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(httpJsonBodyParser())
  .handler(updateHandler);
