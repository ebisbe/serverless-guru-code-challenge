import { describe, it, expect } from "@jest/globals";
import { handler } from "../create";

describe("CREATE List", () => {

  it('receives an empty body', async () => {
    const response = await handler({})

    expect(response).toStrictEqual({
      statusCode: 406,
      headers: {'Content-Type': 'text/plain'},
      body: 'Invalid request. Missing body params.'
    })
  })

  it('creates a new list', () => {})

  it('does not received all required properties', () => {})
});
