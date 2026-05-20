import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SPARTAN_COMPONENTS_BASE, SPARTAN_DOCS_BASE } from "./utils.js";

export function registerHealthTools(server: McpServer): void {
  server.registerTool(
    "spartan_health_check",
    {
      title: "Spartan pages availability check",
      description:
        "Check availability and response times for selected Spartan docs and component pages. This validates the docs site, not your local workspace health check.",
      inputSchema: {
        topics: z
          .array(
            z.enum([
              "installation",
              "cli",
              "theming",
              "dark-mode",
              "typography",
              "health-checks",
              "update-guide",
            ])
          )
          .optional()
          .describe("Docs topics to check; defaults to a standard set."),
        components: z
          .array(z.string())
          .optional()
          .describe(
            "Component names to check; defaults to a small representative set."
          ),
      },
    },
    async (args) => {
      const topics = args.topics && Array.isArray(args.topics)
        ? args.topics
        : ["installation", "cli", "theming", "dark-mode", "typography", "health-checks", "update-guide"];
      const components = args.components && Array.isArray(args.components)
        ? args.components
        : ["accordion", "button", "table", "form-field"];

      interface CheckResult {
        label: string;
        url: string;
        ok: boolean;
        status: number;
        ms: number;
        error?: string;
      }

      const checks: CheckResult[] = [];
      const checkUrl = async (label: string, url: string) => {
        const start = Date.now();
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": "spartan-ui-mcp/1.0" },
          });
          checks.push({ label, url, ok: res.ok, status: res.status, ms: Date.now() - start });
        } catch (err) {
          checks.push({
            label,
            url,
            ok: false,
            status: 0,
            ms: Date.now() - start,
            error: String(err),
          });
        }
      };

      for (const t of topics) {
        await checkUrl(`doc:${t}`, `${SPARTAN_DOCS_BASE}/${encodeURIComponent(t)}`);
      }
      for (const c of components) {
        await checkUrl(`component:${c}`, `${SPARTAN_COMPONENTS_BASE}/${encodeURIComponent(c)}`);
      }

      const summary = {
        timestamp: new Date().toISOString(),
        totals: {
          count: checks.length,
          ok: checks.filter((x) => x.ok).length,
          fail: checks.filter((x) => !x.ok).length,
        },
        checks,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }
  );

  server.registerTool(
    "spartan_health_instructions",
    {
      title: "Spartan CLI health check instructions",
      description:
        "Return official instructions and commands for running the Spartan CLI health check in Angular CLI or Nx workspaces.",
      inputSchema: {},
    },
    async () => {
      const payload = {
        summary: "Run the Spartan CLI health check to scan your project and auto-fix common issues. Use Angular CLI or Nx commands in your project root.",
        prerequisites: [
          "Install Spartan CLI as a dev dependency: npm i -D @spartan-ng/cli",
          "Ensure your workspace uses Angular CLI or Nx",
        ],
        angular_cli_command: "ng g @spartan-ng/cli:healthcheck",
        nx_command: "nx g @spartan-ng/cli:healthcheck",
        source: `${SPARTAN_DOCS_BASE}/health-checks`,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    }
  );

  server.registerTool(
    "spartan_health_command",
    {
      title: "Build Spartan health check command",
      description:
        "Return the exact command to run the Spartan health check for Angular CLI or Nx. Optionally append --dry-run.",
      inputSchema: {
        tool: z
          .enum(["ng", "nx"])
          .describe("Which toolchain to use: Angular CLI (ng) or Nx (nx)."),
        dryRun: z
          .boolean()
          .default(false)
          .describe("Append --dry-run to preview changes."),
      },
    },
    async (args) => {
      const tool = args.tool as "ng" | "nx";
      const dryRun = Boolean(args.dryRun);
      const base = tool === "ng"
        ? "npx ng g @spartan-ng/cli:healthcheck"
        : "npx nx g @spartan-ng/cli:healthcheck";
      const command = dryRun ? `${base} --dry-run` : base;
      return { content: [{ type: "text", text: command }] };
    }
  );
}
