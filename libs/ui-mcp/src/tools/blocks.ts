import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  KNOWN_BLOCKS,
  SPARTAN_BLOCKS_BASE,
  KNOWN_COMPONENTS,
  fetchContent,
  extractCodeBlocks,
  htmlToText,
} from "./utils.js";
import { cacheManager } from "./cache.js";

export function registerBlockTools(server: McpServer): void {
  server.registerTool(
    "spartan_blocks_list",
    {
      title: "List Spartan UI blocks",
      description:
        "Returns a list of known Spartan Angular UI blocks (pre-built UI patterns) with their documentation URLs. " +
        "Blocks are higher-level compositions of components like sidebars, login forms, signup forms, and calendars. " +
        "Use this to discover available blocks, then call spartan_blocks_get with specific block names to get detailed code.",
      inputSchema: {},
    },
    async () => {
      const items = KNOWN_BLOCKS.map((name) => ({
        name,
        url: `${SPARTAN_BLOCKS_BASE}/${name}`,
      }));
      const responseText =
        JSON.stringify({ blocks: items }, null, 2) +
        "\n\nPROCESSING INSTRUCTIONS:\n" +
        "- This list contains all available Spartan UI blocks\n" +
        "- Use spartan_blocks_get with any block name to get detailed code and documentation\n" +
        "- Blocks are pre-built UI patterns composed of multiple components\n" +
        "- Always present block code and dependencies when helping users";
      return {
        content: [{ type: "text", text: responseText }],
      };
    },
  );

  server.registerTool(
    "spartan_blocks_get",
    {
      title: "Get block documentation and code",
      description:
        "Fetch the Spartan UI documentation page for a given block (e.g., 'sidebar', 'login'). " +
        "Blocks are pre-built UI patterns that combine multiple components. " +
        "The response includes complete code examples showing how to use the block.",
      inputSchema: {
        name: z
          .string()
          .min(1, "name is required")
          .describe("Block name (kebab-case), e.g., 'sidebar', 'login', 'signup', 'calendar'."),
        format: z
          .enum(["html", "text"])
          .default("html")
          .describe("Return format: raw HTML or plain text."),
        noCache: z.boolean().default(false).describe("Bypass cache when true."),
        spartanVersion: z
          .string()
          .optional()
          .describe("Spartan UI version to use for caching (e.g., '1.2.3'). If not provided, defaults to 'latest'."),
      },
    },
    async (args) => {
      const name = String(args.name || "").trim().toLowerCase();
      if (!name) throw new Error("Missing block name");
      if (!KNOWN_BLOCKS.includes(name)) {
        throw new Error(`Unknown block: ${name}. Available: ${KNOWN_BLOCKS.join(", ")}`);
      }

      await cacheManager.initialize(args.spartanVersion);

      const url = `${SPARTAN_BLOCKS_BASE}/${encodeURIComponent(name)}`;
      const format = args.format === "text" ? "text" : "html";
      const noCache = Boolean(args.noCache);

      let content: string;
      let cacheInfo = "";

      if (!noCache) {
        const cached = await cacheManager.getBlock(name);
        if (cached.cached && !cached.stale) {
          content = (cached.data as { html: string }).html;
          cacheInfo = `\n[CACHED DATA - Version: ${cached.version}, Cached at: ${cached.cachedAt}]`;
        } else {
          content = await fetchContent(url, format, true);
          const html = content;
          const code = extractCodeBlocks(html);
          await cacheManager.setBlock(name, {
            html,
            code,
            full: { html, code, url },
          });
          cacheInfo = cached.cached ? `\n[CACHE REFRESHED - Version: ${cacheManager.currentVersion}]` : `\n[NEWLY CACHED - Version: ${cacheManager.currentVersion}]`;
        }
      } else {
        content = await fetchContent(url, format, true);
        cacheInfo = "\n[LIVE FETCH - Cache bypassed]";
      }

      const html = format === "text" ? content : content;
      const code = extractCodeBlocks(html);

      const responseText =
        `${content}${cacheInfo}\n\nSource: ${url}\n\n` +
        "PROCESSING INSTRUCTIONS:\n" +
        "- This response contains block documentation and code examples\n" +
        "- Blocks are pre-built UI patterns using Spartan components\n" +
        "- Present the complete code examples for the block\n" +
        "- List the required components and dependencies\n" +
        "- Show how to integrate the block into an Angular application";

      return {
        content: [{ type: "text", text: responseText }],
      };
    },
  );

  server.registerTool(
    "spartan_blocks_dependencies",
    {
      title: "Show block dependencies",
      description:
        "Analyze what components and packages a Spartan UI block requires. " +
        "Blocks are compositions of multiple components, so this shows all underlying dependencies.",
      inputSchema: {
        blockName: z
          .string()
          .min(1, "blockName is required")
          .describe("Spartan block name (e.g., 'sidebar', 'login')"),
      },
    },
    async (args) => {
      const blockName = String(args.blockName || "").trim().toLowerCase();
      if (!KNOWN_BLOCKS.includes(blockName)) {
        throw new Error(`Unknown block: ${blockName}. Available: ${KNOWN_BLOCKS.join(", ")}`);
      }

      const url = `${SPARTAN_BLOCKS_BASE}/${blockName}`;
      const html = await fetchContent(url, "html", false);
      const text = htmlToText(html);

      const dependencies: {
        spartanComponents: string[];
        npmPackages: string[];
        angularCdk: string[];
      } = {
        spartanComponents: [],
        npmPackages: [],
        angularCdk: [],
      };

      // Find referenced Spartan components
      for (const component of KNOWN_COMPONENTS) {
        if (text.toLowerCase().includes(component)) {
          dependencies.spartanComponents.push(component);
        }
      }

      // Find npm packages
      const npmRegex = /npm\s+install\s+([^\n]+)/gi;
      let match;
      while ((match = npmRegex.exec(text)) !== null) {
        const packages = match[1].split(/\s+/).filter((pkg) => pkg.startsWith("@") || !pkg.includes("-"));
        dependencies.npmPackages.push(...packages);
      }

      // Find Angular CDK references
      const cdkComponents = [
        "@angular/cdk/a11y",
        "@angular/cdk/dialog",
        "@angular/cdk/overlay",
        "@angular/cdk/portal",
        "@angular/cdk/scrolling",
      ];
      for (const cdk of cdkComponents) {
        if (text.includes(cdk)) dependencies.angularCdk.push(cdk);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                block: blockName,
                url,
                dependencies,
                installation: [
                  ...dependencies.npmPackages.map((pkg) => `npm install ${pkg}`),
                  ...dependencies.spartanComponents.map((comp) => `npx ng g @spartan-ng/cli:ui ${comp}`),
                ],
                processingInstructions:
                  "Present dependencies with installation commands and setup instructions. Show which Spartan components are used in this block.",
              },
              null,
              2
            ),
          },
        ],
      };
    },
  );
}
