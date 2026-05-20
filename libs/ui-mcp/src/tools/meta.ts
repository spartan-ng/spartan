import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  KNOWN_COMPONENTS,
  KNOWN_BLOCKS,
  DOCUMENTATION_TOPICS,
  SPARTAN_COMPONENTS_BASE,
  SPARTAN_BLOCKS_BASE,
  SPARTAN_DOCS_BASE,
} from "./utils.js";

export function registerMetaTools(server: McpServer): void {
  server.registerTool(
    "spartan_meta",
    {
      title: "Spartan metadata",
      description:
        "Return known docs topics, components, and blocks for client autocomplete.",
      inputSchema: {},
    },
    async () => {
      const responseData = {
        topics: [...DOCUMENTATION_TOPICS, "analog-dark-mode"].map((t) => ({
          topic: t,
          url:
            t === "analog-dark-mode"
              ? "https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049"
              : `${SPARTAN_DOCS_BASE}/${t}`,
        })),
        components: KNOWN_COMPONENTS.map((n) => ({
          name: n,
          url: `${SPARTAN_COMPONENTS_BASE}/${n}`,
        })),
        blocks: KNOWN_BLOCKS.map((n) => ({
          name: n,
          url: `${SPARTAN_BLOCKS_BASE}/${n}`,
        })),
        usage: {
          "spartan.docs.get": "Fetch documentation topics",
          "spartan.components.get": "Fetch component APIs with extract='api' for structured data",
          "spartan.components.list": "List all available components",
          "spartan.blocks.list": "List all available blocks",
          "spartan.blocks.get": "Fetch block documentation and code",
        },
      };
      const responseText =
        JSON.stringify(responseData, null, 2) +
        "\n\nPROCESSING INSTRUCTIONS:\n" +
        "- Use this metadata to understand available topics, components, and blocks\n" +
        "- Always fetch component documentation with extract='api' for structured API data\n" +
        "- Parse and present Brain API and Helm API information from responses\n" +
        "- Include code examples and usage patterns in your responses\n" +
        "- Blocks are pre-built UI patterns composed of multiple components";
      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    }
  );
}
