import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { List } from "../../models/table";
import { z } from "zod";

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  console.log("event", event.body, event.pathParameters);

  if (!event.body) {
    throw new Error("Invalid request. Missing body params.");
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
