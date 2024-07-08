import { describe, expect, it } from "@jest/globals";

import { Item } from "../../../models/table";
import { handler } from "../get";

describe("GET Item", () => {
  it("requires path parameter ID", async () => {
    const response = await handler({
      headers: { "Content-Type": "application/json" },
      body: null,
    });

    expect(response).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: '{"issues":[{"code":"invalid_type","expected":"object","received":"undefined","path":[],"message":"Required"}],"name":"ZodError"}',
    });
  });

  it("returns found item by ID and listId", async () => {
    const item = await Item.create({
      listId: "1",
      name: "<NAME>",
      description: "This is a test item",
    });

    const response = await handler({
      headers: { "Content-Type": "application/json" },
      pathParameters: { id: item.id, listId: item.listId },
      body: null,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body).toStrictEqual(JSON.parse(JSON.stringify(item)));
  });
});
