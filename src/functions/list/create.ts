import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { List } from "../../models/table";
import { z } from "zod";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { HttpError } from "../../utils/httpError";

const createListHandler: Handler<APIGatewayProxyEventV2> = async (event) => {
  if (!event.body) {
    throw new HttpError(406, "Invalid request. Missing body params.");
  }

  const listSchema = z.object({
    userId: z.string(),
    name: z.string(),
    description: z.string(),
  }) satisfies z.ZodType<List>;

  const list = listSchema.parse(JSON.parse(event?.body));

  const createdList = await List.create(list);
  delete createdList.pk;
  delete createdList.sk;
  createdList.createdAt;

  return {
    statusCode: 200,
    body: JSON.stringify(createdList),
  };
};

export const handler = middy()
  .use(httpErrorHandler({ logger: false }))
  .handler(createListHandler);
