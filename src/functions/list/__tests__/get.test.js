import { describe, expect, it } from "@jest/globals";

import { handler } from "../get";

describe("GET List", () => {
  it("requireds path parameter ID", async () => {
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
});
