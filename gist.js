import { graphVirtual, MapValuesGraph } from "@graphorigami/origami";
import fetch from "node-fetch";

export default async function gist(gistId) {
  const gistUrl = `https://api.github.com/gists/${gistId}`;
  const response = await fetch(gistUrl);
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
