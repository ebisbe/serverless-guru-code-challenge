import { describe, expect, it } from "@jest/globals";

import { Item } from "../../../models/table";
import { handler } from "../remove";

describe("REMOVE Item", () => {
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

  it("removes item by ID", async () => {
    const item = await Item.create({
      listId: "listId",
      name: "<NAME>",
      description: "This is a test item",
      price: 15,
    });

    const response = await handler({
      headers: { "Content-Type": "application/json" },
      pathParameters: { id: item.id, listId: "listId" },
      body: null,
    });

    expect(response).toStrictEqual({
      statusCode: 200,
      body: null,
    });
  });
});
