import { describe, expect, it } from "@jest/globals";

import { Item } from "../../../models/table";
import { handler } from "../update";

describe("UPDATE Item", () => {
  it("requires path parameter ID", async () => {
    const response = await handler({
      headers: { "Content-Type": "application/json" },
      body: null,
    });

    expect(response).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: '{"issues":[{"code":"invalid_type","expected":"object","received":"null","path":[],"message":"Expected object, received null"}],"name":"ZodError"}',
    });
  });

  it("returns found item by ID", async () => {
    const item = await Item.create({
      listId: "listId",
      name: "<NAME>",
      description: "This is a test item",
    });

    const response = await handler({
      headers: { "Content-Type": "application/json" },
      pathParameters: { id: item.id, listId: "listId" },
      body: JSON.stringify({
        name: "Name v2",
        description: "Description v2",
        price: 16,
      }),
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.name).toBe("Name v2");
    expect(body.description).toBe("Description v2");
  });
});
