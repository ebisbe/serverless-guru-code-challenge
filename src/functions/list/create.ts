import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { List } from "../../models/table";
import { z } from "zod";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { HttpError } from "../../utils/httpError";
import { ValidationError } from "../../utils/validationError";

const createListHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  if (!event.body) {
    throw new HttpError(400, "Invalid request. Missing body params.");
  }

  const listSchema = z.object({
    userId: z.string(),
    name: z.string(),
    description: z.string(),
  }) satisfies z.ZodType<List>;

  const list = listSchema.safeParse(event.body);
  if (!list.success) {
    throw new ValidationError(400, list.error);
  }

  const createdList = await List.create(list.data);
  delete createdList.pk;
  delete createdList.sk;

  return {
    statusCode: 200,
    body: JSON.stringify(createdList),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .use(httpJsonBodyParser())
  .handler(createListHandler);
