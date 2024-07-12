import { describe, expect, it } from "@jest/globals";
import { config } from "dotenv";
config({ path: ".env.e2e" });

const { API_GATEWAY_URL: endpoint } = process.env;

const wrapper = ({ path = "", method, body }) => {
  const headers = { Accept: "application/json" };
  if (path !== "GET") {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${endpoint}/list` + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Testing LIST endpoints", () => {
  let listId;
  it("creates a new list", async () => {
    const resp = await wrapper({
      method: "POST",
      body: {
        name: "New List name",
        description: "some description",
      },
    });
    const createdList = await resp.json();

    listId = createdList.id;

    expect(createdList).toMatchObject({
      name: "New List name",
      description: "some description",
    });
  });

  describe("testing items creation", () => {
    let itemId;
    it("creates a new item", async () => {
      const resp = await wrapper({
        path: `/${listId}/item`,
        method: "POST",
        body: {
          listId,
          name: "New Item Name",
          description: "some description",
          price: 15,
        },
      });
      const body = await resp.json();

      itemId = body.id;

      expect(body).toMatchObject({
        listId,
        name: "New Item Name",
        description: "some description",
      });

      await sleep(1000);
      const resp2 = await wrapper({
        path: `/${listId}`,
        method: "GET",
      });

      const list = await resp2.json();

      expect(list).toMatchObject({
        id: listId,
        totalItems: 1,
        totalPrice: 15,
      });
    });

    it("updates an item", async () => {
      const resp = await wrapper({
        path: `/${listId}/item/${itemId}`,
        method: "PATCH",
        body: {
          listId,
          name: "v2",
          description: "v2",
          price: 25,
        },
      });

      expect(await resp.json()).toMatchObject({
        listId,
        id: itemId,
        name: "v2",
        description: "v2",
        price: 25,
      });

      await sleep(1000);

      const resp2 = await wrapper({
        path: `/${listId}`,
        method: "GET",
      });

      const list = await resp2.json();

      expect(list).toMatchObject({
        id: listId,
        totalItems: 1,
        totalPrice: 25,
      });
    });

    it("deletes an item", async () => {
      const resp = await wrapper({
        path: `/${listId}/item/${itemId}`,
        method: "DELETE",
        body: "{}",
      });

      expect(resp.status).toBe(200);

      await sleep(1000);

      const resp2 = await wrapper({
        path: `/${listId}`,
        method: "GET",
      });

      const list = await resp2.json();

      expect(list).toMatchObject({
        id: listId,
        totalItems: 0,
        totalPrice: 0,
      });
    });
  });

  describe("testing other list methods", () => {
    it("updates a list", async () => {
      const updatedList = await wrapper({
        path: `/${listId}`,
        method: "PATCH",
        body: {
          name: "v2",
          description: "v2",
        },
      });

      expect(await updatedList.json()).toMatchObject({
        name: "v2",
        description: "v2",
      });
    });

    it("deletes the list", async () => {
      const removeList = await wrapper({
        path: `/${listId}`,
        method: "DELETE",
        body: "{}",
      });

      expect(removeList.status).toBe(200);
    });
  });
});
