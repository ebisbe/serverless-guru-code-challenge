import { describe, expect, it } from "@jest/globals";

import { handler } from "../create";

describe("CREATE Item", () => {
  it("receives an empty body", async () => {
    const response = await handler({
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });

    expect(response).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: '{"issues":[{"code":"invalid_type","expected":"object","received":"null","path":[],"message":"Expected object, received null"}],"name":"ZodError"}',
    });
  });

  it("creates a new item", async () => {
    const event = {
      headers: {
        "Content-Type": "application/json",
      },
      pathParameters: { listId: "1" },
      body: JSON.stringify({
        name: "My Wedding Item",
        description: "This is my wedding gift item.",
        price: 15,
      }),
    };
    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.id).toMatch(/^[A-Z0-9]{26}$/);
    expect(body.listId).toBe("1");
    expect(body.name).toBe("My Wedding Item");
    expect(body.description).toBe("This is my wedding gift item.");
    expect(body.price).toBe(15);

    const dateRegExp =
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/;
    expect(body.createdAt).toMatch(dateRegExp);
    expect(body.updatedAt).toMatch(dateRegExp);
  });

  it("does not received all required properties", async () => {
    const event = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ param: "1" }),
    };
    const response = await handler(event);

    expect(response).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: '{"issues":[{"code":"invalid_type","expected":"string","received":"undefined","path":["name"],"message":"Required"},{"code":"invalid_type","expected":"string","received":"undefined","path":["description"],"message":"Required"},{"code":"invalid_type","expected":"number","received":"undefined","path":["price"],"message":"Required"}],"name":"ZodError"}',
    });
  });
});
