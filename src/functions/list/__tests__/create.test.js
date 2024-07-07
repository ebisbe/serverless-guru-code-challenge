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
      headers: { "Content-Type": "text/plain" },
      body: "Invalid request. Missing body params.",
    });
  });

  it("creates a new list", () => {});

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
