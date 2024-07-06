import { describe, it, expect } from "@jest/globals";
import { handler } from "../create";

describe("CREATE List", () => {

  it('receives an empty body', async () => {
    await handler({})
    expect(true).toBe(false)
  })

  it('creates a new list', () => {})

  it('does not received all required properties', () => {})
});
