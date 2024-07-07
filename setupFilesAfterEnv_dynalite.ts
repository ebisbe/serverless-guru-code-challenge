import { client } from "./src/models/table";

afterEach(() => {
  client.destroy();
});
