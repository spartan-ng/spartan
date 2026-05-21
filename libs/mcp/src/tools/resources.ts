import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  KNOWN_COMPONENTS,
  SPARTAN_COMPONENTS_BASE,
  fetchContent,
  extractCodeBlocks,
  extractAPIInfo,
} from "./utils.js";

export function registerResourceHandlers(server: McpServer): void {
  server.resource(
    "Spartan UI Components List",
    "spartan://components/list",
    {
      description: "Complete list of all available Spartan UI components with URLs",
      mimeType: "application/json",
    },
    async () => {
      return {
        contents: [
          {
            uri: "spartan://components/list",
            mimeType: "application/json",
            text: JSON.stringify(
              {
                components: KNOWN_COMPONENTS.map((name) => ({
                  name,
                  url: `${SPARTAN_COMPONENTS_BASE}/${name}`,
                  apiResource: `spartan://component/${name}/api`,
                  examplesResource: `spartan://component/${name}/examples`,
                  fullResource: `spartan://component/${name}/full`,
                })),
                totalComponents: KNOWN_COMPONENTS.length,
                metadata: {
                  description: "Spartan UI is a collection of Angular UI components",
                  baseUrl: "https://www.spartan.ng",
                  documentation: "https://www.spartan.ng/documentation",
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  const apiTemplate = new ResourceTemplate("spartan://component/{name}/api", {
    list: async () => {
      return {
        resources: KNOWN_COMPONENTS.map((name) => ({
          uri: `spartan://component/${name}/api`,
          name: `${name} - API Documentation`,
          description: `Brain API and Helm API specifications for ${name} component`,
          mimeType: "application/json",
        })),
      };
    },
    complete: {},
  });

  server.resource(
    "Component API Documentation",
    apiTemplate,
    {
      description: "Brain API and Helm API specifications for Spartan UI components",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const name = Array.isArray(variables.name) ? variables.name[0] : variables.name;

      if (!KNOWN_COMPONENTS.includes(name)) {
        throw new Error(`Unknown component: ${name}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${name}`;
      const html = await fetchContent(componentUrl, "html", false);
      const apiData = extractAPIInfo(html);

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(
              {
                component: name,
                url: componentUrl,
                brainAPI: apiData.brainAPI,
                helmAPI: apiData.helmAPI,
                metadata: {
                  brainAPICount: apiData.brainAPI.length,
                  helmAPICount: apiData.helmAPI.length,
                  description: "Brain API provides unstyled, accessible primitives. Helm API provides pre-styled components.",
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  const examplesTemplate = new ResourceTemplate("spartan://component/{name}/examples", {
    list: async () => {
      return {
        resources: KNOWN_COMPONENTS.map((name) => ({
          uri: `spartan://component/${name}/examples`,
          name: `${name} - Code Examples`,
          description: `Working code examples for ${name} component`,
          mimeType: "application/json",
        })),
      };
    },
    complete: {},
  });

  server.resource(
    "Component Code Examples",
    examplesTemplate,
    {
      description: "Working code examples for Spartan UI components",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const name = Array.isArray(variables.name) ? variables.name[0] : variables.name;

      if (!KNOWN_COMPONENTS.includes(name)) {
        throw new Error(`Unknown component: ${name}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${name}`;
      const html = await fetchContent(componentUrl, "html", false);
      const codeBlocks = extractCodeBlocks(html);

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(
              {
                component: name,
                url: componentUrl,
                examples: codeBlocks.map((block, index) => ({
                  id: index + 1,
                  title: block.title || `Example ${index + 1}`,
                  code: block.code,
                  language: block.language,
                })),
                metadata: {
                  totalExamples: codeBlocks.length,
                  description: `Working code examples for ${name} component`,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  const fullTemplate = new ResourceTemplate("spartan://component/{name}/full", {
    list: async () => {
      return {
        resources: KNOWN_COMPONENTS.map((name) => ({
          uri: `spartan://component/${name}/full`,
          name: `${name} - Complete Documentation`,
          description: `Complete documentation including API, examples, and metadata for ${name}`,
          mimeType: "application/json",
        })),
      };
    },
    complete: {},
  });

  server.resource(
    "Component Full Documentation",
    fullTemplate,
    {
      description: "Complete documentation including API, examples, and metadata",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const name = Array.isArray(variables.name) ? variables.name[0] : variables.name;

      if (!KNOWN_COMPONENTS.includes(name)) {
        throw new Error(`Unknown component: ${name}`);
      }

      const componentUrl = `${SPARTAN_COMPONENTS_BASE}/${name}`;
      const html = await fetchContent(componentUrl, "html", false);
      const apiData = extractAPIInfo(html);
      const codeBlocks = extractCodeBlocks(html);

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(
              {
                component: name,
                url: componentUrl,
                api: {
                  brainAPI: apiData.brainAPI,
                  helmAPI: apiData.helmAPI,
                },
                examples: codeBlocks.map((block, index) => ({
                  id: index + 1,
                  title: block.title || apiData.examples[index]?.title || `Example ${index + 1}`,
                  code: block.code,
                  language: block.language,
                })),
                metadata: {
                  brainAPICount: apiData.brainAPI.length,
                  helmAPICount: apiData.helmAPI.length,
                  totalExamples: codeBlocks.length,
                  fetchedAt: new Date().toISOString(),
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
