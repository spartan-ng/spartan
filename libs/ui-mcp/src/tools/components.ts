import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cacheManager } from "./cache.js";
import {
  KNOWN_COMPONENTS,
  SPARTAN_COMPONENTS_BASE,
  extractAPIInfo,
  extractCodeBlocks,
  fetchContent,
  type APIInfo,
  type CodeBlock,
} from "./utils.js";

interface ComponentSnapshot {
  html: string;
  api: APIInfo;
  examples: CodeBlock[];
  url: string;
}

function isComponentSnapshot(value: unknown): value is ComponentSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ComponentSnapshot>;
  return (
    typeof candidate.html === "string" &&
    Array.isArray(candidate.examples) &&
    typeof candidate.url === "string" &&
    candidate.api !== undefined
  );
}

export function registerComponentTools(server: McpServer): void {
  server.registerTool(
    "spartan_components_list",
    {
      title: "List Spartan UI components",
      description:
        "Returns a list of known Spartan Angular UI components with their documentation URLs. " +
        "Use this to discover available components, then call spartan_components_get with specific component names to get detailed API documentation.",
      inputSchema: {},
    },
    async () => {
      const items = KNOWN_COMPONENTS.map((name) => ({
        name,
        url: `${SPARTAN_COMPONENTS_BASE}/${name}`,
      }));
      const responseText =
        JSON.stringify({ components: items }, null, 2) +
        "\n\nPROCESSING INSTRUCTIONS:\n" +
        "- This list contains all available Spartan UI components\n" +
        "- Use spartan_components_get with any component name to get detailed API documentation\n" +
        "- Each component has Brain API (Brn*) and Helm API (Hlm*) variants\n" +
        "- Always present component options and APIs when helping users";
      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    },
  );

  server.registerTool(
    "spartan_components_get",
    {
      title: "Get component documentation",
      description:
        "Fetch the Spartan UI documentation page for a given component (e.g., 'accordion'). " +
        "IMPORTANT: The response contains comprehensive API information including Brain API (Brn*) and Helm API (Hlm*) components with their inputs, outputs, selectors, and examples. " +
        "Always parse and present the API tables, code examples, and component specifications from the response. " +
        "Look for structured sections like 'Brain API', 'Helm API', and 'Examples' in the response.",
      inputSchema: {
        name: z
          .string()
          .min(1, "name is required")
          .describe("Component name (kebab-case), e.g., 'accordion'."),
        format: z
          .enum(["html"])
          .default("html")
          .describe("Return format: raw HTML or plain text."),
        extract: z
          .enum(["code", "api"])
          .default("code")
          .describe(
            "Optional extraction: 'code' for code blocks, 'headings' for section headers, 'links' for URLs, 'api' for structured API information.",
          ),
        noCache: z.boolean().default(false).describe("Bypass cache when true."),
        spartanVersion: z
          .string()
          .optional()
          .describe(
            "Spartan UI version to use for caching (e.g., '1.2.3'). If not provided, defaults to 'latest'.",
          ),
      },
    },
    async (args) => {
      const name = String(args.name || "")
        .trim()
        .toLowerCase();
      if (!name) throw new Error("Missing component name");

      await cacheManager.initialize(args.spartanVersion);

      const url = `${SPARTAN_COMPONENTS_BASE}/${encodeURIComponent(name)}`;
      const format = args.format;
      const extract = args.extract || "code";
      const noCache = Boolean(args.noCache);

      let snapshot: ComponentSnapshot;
      let cacheInfo = "";

      if (!noCache) {
        const cached = await cacheManager.getComponent(name, "full");
        if (
          cached.cached &&
          !cached.stale &&
          isComponentSnapshot(cached.data)
        ) {
          snapshot = cached.data;
          cacheInfo = `\n[CACHED DATA - Version: ${cached.version}, Cached at: ${cached.cachedAt}]`;
        } else {
          const html = await fetchContent(url, "html", true);
          const api = extractAPIInfo(html);
          const examples = extractCodeBlocks(html);
          snapshot = { html, api, examples, url };
          await cacheManager.setComponent(name, {
            html,
            api,
            examples,
            full: snapshot,
          });
          cacheInfo = cached.cached
            ? `\n[CACHE REFRESHED - Version: ${cacheManager.currentVersion}]`
            : `\n[NEWLY CACHED - Version: ${cacheManager.currentVersion}]`;
        }
      } else {
        const html = await fetchContent(url, "html", true);
        snapshot = {
          html,
          api: extractAPIInfo(html),
          examples: extractCodeBlocks(html),
          url,
        };
        cacheInfo = "\n[LIVE FETCH - Cache bypassed]";
      }

      let extracted: unknown[];
      if (extract === "code") extracted = snapshot.examples;
      else if (extract === "api") extracted = [snapshot.api];
      else extracted = [];
      const payload = {
        url,
        extract,
        count: Array.isArray(extracted) ? extracted.length : 0,
        data: extracted,
        cacheInfo: cacheInfo.trim(),
        version: cacheManager.currentVersion,
        processingInstructions:
          "Always parse and present the API information, code examples, and component specifications from this data.",
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    },
  );
}
