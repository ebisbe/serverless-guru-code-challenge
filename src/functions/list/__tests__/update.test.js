import { describe, expect, it } from "@jest/globals";

import { List } from "../../../models/table";
import { handler } from "../update";

describe("UPDATE List", () => {
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

  it("returns found list by ID", async () => {
    const list = await List.create({
      name: "<NAME>",
      description: "This is a test list",
    });

    const response = await handler({
      headers: { "Content-Type": "application/json" },
      pathParameters: { id: list.id },
      body: JSON.stringify({ name: "Name v2", description: "Description v2" }),
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.name).toBe("Name v2");
    expect(body.description).toBe("Description v2");
  });
});
