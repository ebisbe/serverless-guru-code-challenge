import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { z } from "zod";

import { Item } from "../../models/table";
import { ValidationError } from "../../utils/validationError";

const updateHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const itemSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
  }) satisfies z.ZodType<Item>;

  const item = itemSchema.safeParse(event.body);
  if (!item.success) {
    throw new ValidationError(400, item.error);
  }

  const updateItemRaw = {
    id: event.pathParameters?.id,
    listId: event.pathParameters?.listId,
    ...item.data,
  };
  const updatedItem = await Item.update(updateItemRaw);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedItem),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(httpJsonBodyParser())
  .handler(updateHandler);
