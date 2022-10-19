import { graphVirtual, MapValuesGraph } from "@graphorigami/origami";
import * as dotenv from "dotenv";
import { default as fetch, Headers } from "node-fetch";

if (process.env.NODE_ENV !== "production") {
  // When developing, load environment variables from local .env file.
  dotenv.config();
}
const token = process.env.GITHUB_API_TOKEN;

export default async function gist(gistId) {
  const gistUrl = `https://api.github.com/gists/${gistId}`;
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  });
  const response = await fetch(gistUrl, { headers });
  if (response.ok) {
    const { files } = await response.json();
    // Top-level `files` has the actual file content in `content` properties.
    const graph = new MapValuesGraph(files, (file) => file.get("content"));
    const meta = await graphVirtual.call(this, graph);
    return meta;
  } else {
    return undefined;
  }
}
