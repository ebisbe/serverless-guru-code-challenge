import { describe, expect, it } from "@jest/globals";

import { List } from "../../../models/table";
import { handler } from "../remove";

describe("REMOVE List", () => {
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

  it("removes list by ID", async () => {
    const list = await List.create({
      name: "<NAME>",
      description: "This is a test list",
    });

    const response = await handler({
      headers: { "Content-Type": "application/json" },
      pathParameters: { id: list.id },
      body: null,
    });

    expect(response).toStrictEqual({
      statusCode: 200,
      body: null,
    });
  });
});
