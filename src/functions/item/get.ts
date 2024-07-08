import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { z } from "zod";

import { Item } from "../../models/table";
import { ValidationError } from "../../utils/validationError";

const getItemHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const itemSchema = z.object({
    id: z.string(),
    listId: z.string(),
  });

  const item = itemSchema.safeParse(event.pathParameters);
  if (!item.success) {
    throw new ValidationError(400, item.error);
  }

  const itemData = await Item.get({
    id: item.data.id,
    listId: item.data.listId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(itemData),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(httpJsonBodyParser())
  .handler(getItemHandler);
