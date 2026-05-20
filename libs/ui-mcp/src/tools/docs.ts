import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  DOCUMENTATION_TOPICS,
  SPARTAN_DOCS_BASE,
  fetchContent,
  extractCodeBlocks,
  extractHeadings,
  extractLinks,
} from "./utils.js";
import { cacheManager } from "./cache.js";

export function registerDocsTools(server: McpServer): void {
  server.registerTool(
    "spartan_docs_get",
    {
      title: "Get a Spartan docs section",
      description:
        "Fetch an official Spartan documentation section by topic (installation, cli, theming, dark-mode, typography, health-checks, update-guide).",
      inputSchema: {
        topic: z
          .enum([
            "installation",
            "cli",
            "theming",
            "dark-mode",
            "typography",
            "health-checks",
            "update-guide",
            "analog-dark-mode",
          ])
          .describe(
            "Documentation topic to fetch. Includes 'analog-dark-mode' external article.",
          ),
        format: z
          .enum(["html", "text"])
          .default("html")
          .describe("Return format: raw HTML or plain text."),
        extract: z
          .enum(["none", "code", "headings", "links"])
          .default("code")
          .describe("Optional extraction: code blocks, headings, or links."),
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
      const topic = args.topic;
      const format = args.format === "text" ? "text" : "html";
      const extract = args.extract || "none";
      const noCache = Boolean(args.noCache);

      await cacheManager.initialize(args.spartanVersion);

      const url =
        topic === "analog-dark-mode"
          ? "https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049"
          : `${SPARTAN_DOCS_BASE}/${encodeURIComponent(topic)}`;

      let content: string;
      let cacheInfo = "";

      if (!noCache && topic !== "analog-dark-mode") {
        const cached = await cacheManager.getDocs(topic);
        if (cached.cached && !cached.stale) {
          content = cached.data!;
          cacheInfo = `\n[CACHED DATA - Version: ${cached.version}, Cached at: ${cached.cachedAt}]`;
        } else if (cached.cached && cached.stale) {
          content = await fetchContent(url, format, true);
          await cacheManager.setDocs(topic, content);
          cacheInfo = `\n[CACHE REFRESHED - Version: ${cacheManager.currentVersion}]`;
        } else {
          content = await fetchContent(url, format, true);
          await cacheManager.setDocs(topic, content);
          cacheInfo = `\n[NEWLY CACHED - Version: ${cacheManager.currentVersion}]`;
        }
      } else {
        content = await fetchContent(url, format, noCache);
        cacheInfo = noCache ? "\n[LIVE FETCH - Cache bypassed]" : "";
      }

      if (extract === "none" || format === "text") {
        return {
          content: [
            { type: "text", text: `${content}${cacheInfo}\n\nSource: ${url}` },
          ],
        };
      }
      const html = await fetchContent(url, "html", noCache);
      let extracted: unknown[];
      if (extract === "code") extracted = extractCodeBlocks(html);
      else if (extract === "headings") extracted = extractHeadings(html);
      else if (extract === "links") extracted = extractLinks(html);
      else extracted = [];
      const payload = {
        url,
        extract,
        count: Array.isArray(extracted) ? extracted.length : 0,
        data: extracted,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    },
  );
}
