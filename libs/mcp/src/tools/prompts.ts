import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  KNOWN_COMPONENTS,
  SPARTAN_COMPONENTS_BASE,
  fetchContent,
  extractAPIInfo,
  extractCodeBlocks,
} from "./utils.js";

export function registerPromptHandlers(server: McpServer): void {
  server.prompt(
    "spartan-get-started",
    "Get started with a Spartan UI component",
    {
      componentName: z.string().describe("Name of the Spartan UI component (e.g., 'button', 'calendar')"),
      variant: z.enum(["brain", "helm"]).optional().describe("Which API to use: 'brain' (unstyled) or 'helm' (styled)"),
    },
    async (args) => {
      const componentName = args.componentName.toLowerCase();
      const variant = args.variant?.toLowerCase() || "helm";

      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(
          `Unknown component: ${componentName}. Available: ${KNOWN_COMPONENTS.slice(0, 5).join(", ")}...`
        );
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
      const html = await fetchContent(componentUrl, "html", false);
      const apiData = extractAPIInfo(html);
      const codeBlocks = extractCodeBlocks(html);

      const relevantAPI = variant === "brain" ? apiData.brainAPI : apiData.helmAPI;
      const firstExample = codeBlocks[0] || "No examples available";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Help me get started with the Spartan UI ${componentName} component using the ${variant.toUpperCase()} API.`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `# Getting Started with Spartan UI ${componentName.toUpperCase()}

## Overview
The **${componentName}** component is available at: ${componentUrl}

## ${variant.toUpperCase()} API
${
  relevantAPI.length > 0
    ? `This component has ${relevantAPI.length} ${variant} API component(s):

${relevantAPI.map((comp, i) => `### ${i + 1}. ${comp.name}
${comp.selector ? `**Selector**: \`${comp.selector}\`` : ""}

**Inputs**:
${comp.inputs.map((input) => `- \`${input.prop}\`: ${input.type}${input.default !== "-" ? ` (default: ${input.default})` : ""}`).join("\n")}

${comp.outputs.length > 0 ? `**Outputs**:\n${comp.outputs.map((output) => `- \`${output.prop}\`: ${output.type}`).join("\n")}` : ""}
`).join("\n")}`
    : `No ${variant} API components found.`
}

## Quick Start Example

\`\`\`typescript
${firstExample}
\`\`\`

## Installation

\`\`\`bash
npm install @spartan-ng/${variant === "brain" ? "brain" : "helm"}/${componentName}
\`\`\`

## Next Steps
1. Import the component in your Angular module/component
2. Use the selector in your template
3. Configure inputs as needed
4. Check the documentation for more examples: ${componentUrl}
`,
            },
          },
        ],
      };
    }
  );

  server.prompt(
    "spartan-compare-apis",
    "Compare Brain API vs Helm API for a component",
    {
      componentName: z.string().describe("Name of the Spartan UI component to compare"),
    },
    async (args) => {
      const componentName = args.componentName.toLowerCase();

      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(`Unknown component: ${componentName}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
      const html = await fetchContent(componentUrl, "html", false);
      const apiData = extractAPIInfo(html);

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Compare the Brain API and Helm API for the ${componentName} component. When should I use each?`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `# Brain API vs Helm API: ${componentName.toUpperCase()}

## Brain API (Unstyled, Accessible Primitives)
${apiData.brainAPI.length > 0 ? `Available Components: ${apiData.brainAPI.length}` : "No Brain API components available."}

## Helm API (Pre-styled Components)
${apiData.helmAPI.length > 0 ? `Available Components: ${apiData.helmAPI.length}` : "No Helm API components available."}

## Summary
| Aspect | Brain API | Helm API |
|--------|-----------|----------|
| Styling | Unstyled | Tailwind CSS |
| Complexity | Higher | Lower |
| Flexibility | Maximum | Moderate |
| Components | ${apiData.brainAPI.length} | ${apiData.helmAPI.length} |

More details: ${componentUrl}
`,
            },
          },
        ],
      };
    }
  );

  server.prompt(
    "spartan-implement-feature",
    "Get help implementing a specific feature with a Spartan UI component",
    {
      componentName: z.string().describe("Spartan UI component to use"),
      feature: z.string().describe("Feature to implement (e.g., 'form validation', 'multi-select', 'date range')"),
      framework: z.string().optional().describe("Framework context (e.g., 'standalone', 'NgModule', 'with Signals')"),
    },
    async (args) => {
      const componentName = args.componentName.toLowerCase();
      const feature = args.feature;
      const framework = args.framework || "standalone";

      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(`Unknown component: ${componentName}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
      const html = await fetchContent(componentUrl, "html", false);
      const apiData = extractAPIInfo(html);
      const codeBlocks = extractCodeBlocks(html);

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to implement ${feature} using the Spartan UI ${componentName} component in a ${framework} Angular application. Can you help me?`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `# Implementing "${feature}" with Spartan UI ${componentName}

## Component Overview
**Documentation**: ${componentUrl}
**Available APIs**: ${apiData.brainAPI.length} Brain + ${apiData.helmAPI.length} Helm

## Example Implementation (${framework})

\`\`\`typescript
${codeBlocks[0] || `// Basic example for ${componentName}`}
\`\`\`

Need more help? Check the full documentation: ${componentUrl}
`,
            },
          },
        ],
      };
    }
  );

  server.prompt(
    "spartan-troubleshoot",
    "Get help troubleshooting issues with a Spartan UI component",
    {
      componentName: z.string().describe("Component you're having issues with"),
      issue: z.string().describe("Description of the problem"),
    },
    async (args) => {
      const componentName = args.componentName.toLowerCase();
      const issue = args.issue;

      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(`Unknown component: ${componentName}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I'm having trouble with the Spartan UI ${componentName} component. Issue: ${issue}`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `# Troubleshooting Spartan UI ${componentName.toUpperCase()}

## Your Issue
> ${issue}

## Common Issues & Solutions

### 1. Check Imports
\`\`\`typescript
import { Hlm${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Imports } from '@spartan-ng/helm/${componentName}';
import { Brn${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Imports } from '@spartan-ng/brain/${componentName}';
\`\`\`

### 2. Verify Dependencies
\`\`\`bash
npm install @spartan-ng/helm/${componentName}
npm install @angular/cdk
\`\`\`

### 3. Check Angular Version
Spartan UI requires Angular 17+ with standalone components support.

## Next Steps
1. Compare your code with examples: ${componentUrl}
2. Check browser console for errors
3. Verify all imports are correct

Still stuck? Provide more details about your setup and error messages.
`,
            },
          },
        ],
      };
    }
  );

  server.prompt(
    "spartan-list-components",
    "List all available Spartan UI components with their categories",
    async () => {
      const categories: Record<string, string[]> = {
        "Form Controls": ["autocomplete", "button", "button-group", "checkbox", "field", "input", "input-group", "input-otp", "item", "label", "native-select", "radio-group", "select", "switch", "textarea", "toggle", "toggle-group", "slider"],
        "Data Display": ["table", "card", "badge", "avatar", "separator", "progress", "skeleton", "spinner"],
        Navigation: ["breadcrumb", "menubar", "pagination", "tabs", "command"],
        Feedback: ["alert", "alert-dialog", "dialog", "sonner", "tooltip", "hover-card"],
        Overlay: ["popover", "dropdown-menu", "context-menu", "sheet"],
        Layout: ["aspect-ratio", "scroll-area", "collapsible", "accordion", "carousel", "resizable", "sidebar"],
        "Date & Time": ["calendar", "date-picker"],
        Advanced: ["data-table", "form-field", "combobox", "icon", "navigation-menu"],
        Utility: ["empty", "kbd"],
      };
      const categorized = new Set(Object.values(categories).flat());
      const additional = KNOWN_COMPONENTS.filter((component) => !categorized.has(component));

      if (additional.length > 0) {
        categories["Additional Components"] = additional;
      }

      const categorizedList = Object.entries(categories)
        .map(([category, components]) => {
          const available = components.filter((c) => KNOWN_COMPONENTS.includes(c));
          return `## ${category} (${available.length})\n${available.map((c) => `- **${c}**: \`spartan://component/${c}/api\``).join("\n")}`;
        })
        .join("\n\n");

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "Show me all available Spartan UI components organized by category.",
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `# Spartan UI Component Library

**Total Components**: ${KNOWN_COMPONENTS.length}
**Documentation**: https://www.spartan.ng

${categorizedList}

## How to Use
1. Pick a component from above
2. Use the prompt: \`spartan-get-started\` with the component name
3. Or access directly: \`spartan://component/<name>/api\`
`,
            },
          },
        ],
      };
    }
  );
}
