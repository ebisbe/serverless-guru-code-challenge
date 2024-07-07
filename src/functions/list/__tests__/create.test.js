import { describe, expect, it } from "@jest/globals";

import { handler } from "../create";

describe("CREATE List", () => {
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

  it("creates a new list", async () => {
    const event = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "userId",
        name: "My Wedding List",
        description: "This is my wedding gift list.",
      }),
    };
    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.id).toMatch(/^[A-Z0-9]{26}$/);
    expect(body.userId).toBe("userId");
    expect(body.name).toBe("My Wedding List");
    expect(body.description).toBe("This is my wedding gift list.");
    expect(body.totalValue).toBe(0);
    expect(body.totalItems).toBe(0);

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
      body: '{"issues":[{"code":"invalid_type","expected":"string","received":"undefined","path":["userId"],"message":"Required"},{"code":"invalid_type","expected":"string","received":"undefined","path":["name"],"message":"Required"},{"code":"invalid_type","expected":"string","received":"undefined","path":["description"],"message":"Required"}],"name":"ZodError"}',
    });
  });
});
