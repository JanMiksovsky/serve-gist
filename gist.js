import { graphVirtual, MapValuesGraph } from "@graphorigami/origami";
import * as dotenv from "dotenv";
import { default as fetch, Headers } from "node-fetch";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const token = process.env.GITHUB_TOKEN;

export default async function gist(gistId) {
  const gistUrl = `https://api.github.com/gists/${gistId}`;
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  });
  const response = await fetch(gistUrl, { headers });
  if (response.ok) {
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw error;
    }
    const { files } = json;
    // Top-level `files` has the actual file content in `content` properties.
    const graph = new MapValuesGraph(files, (file) => file.get("content"));
    const meta = await graphVirtual.call(this, graph);
    return meta;
  } else {
    return undefined;
  }
}
