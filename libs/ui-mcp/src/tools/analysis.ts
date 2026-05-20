import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  KNOWN_COMPONENTS,
  SPARTAN_COMPONENTS_BASE,
  fetchContent,
  extractAPIInfo,
  htmlToText,
} from "./utils.js";

export function registerAnalysisTools(server: McpServer): void {
  server.registerTool(
    "spartan_components_dependencies",
    {
      title: "Show component dependencies",
      description:
        "Analyze what other components, packages, or dependencies a Spartan UI component requires. " +
        "Includes Angular CDK dependencies, peer components, and installation requirements.",
      inputSchema: {
        componentName: z
          .string()
          .min(1, "componentName is required")
          .describe("Spartan component name (e.g., 'calendar', 'dialog')"),
        includeTransitive: z
          .boolean()
          .default(false)
          .describe("Include transitive dependencies (dependencies of dependencies)"),
      },
    },
    async (args) => {
      const componentName = String(args.componentName || "").trim().toLowerCase();
      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(
          `Unknown component: ${componentName}. Available: ${KNOWN_COMPONENTS.join(", ")}`
        );
      }

      const dependencies = await analyzeComponentDependencies(componentName, args.includeTransitive);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                component: componentName,
                dependencies,
                processingInstructions:
                  "Present dependencies with installation commands, import statements, and setup instructions. Group by type (npm packages, Angular CDK, peer components).",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "spartan_accessibility_check",
    {
      title: "Check component accessibility features",
      description:
        "Analyze accessibility features, ARIA support, keyboard navigation, and screen reader compatibility " +
        "for a Spartan UI component. Provides accessibility best practices and implementation guidance.",
      inputSchema: {
        componentName: z
          .string()
          .min(1, "componentName is required")
          .describe("Spartan component name"),
        checkType: z
          .enum(["overview", "aria", "keyboard", "screenreader", "wcag", "all"])
          .default("all")
          .describe("Type of accessibility check: specific area or 'all' for comprehensive analysis"),
      },
    },
    async (args) => {
      const componentName = String(args.componentName || "").trim().toLowerCase();
      if (!KNOWN_COMPONENTS.includes(componentName)) {
        throw new Error(`Unknown component: ${componentName}`);
      }

      const accessibility = await analyzeAccessibility(componentName, args.checkType);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                component: componentName,
                checkType: args.checkType,
                accessibility,
                processingInstructions:
                  "Present accessibility information with actionable recommendations, code examples, and compliance notes for WCAG guidelines.",
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

interface Dependencies {
  npm: string[];
  angularCdk: string[];
  peerComponents: string[];
  imports: Array<{ items: string; from: string }>;
  setup: string[];
  transitive?: Array<{ component: string; dependencies: string[] }>;
}

async function analyzeComponentDependencies(componentName: string, includeTransitive: boolean): Promise<Dependencies> {
  try {
    const url = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
    const html = await fetchContent(url, "html", false);
    const text = htmlToText(html);
    const apiInfo = extractAPIInfo(html);

    const dependencies: Dependencies = {
      npm: [],
      angularCdk: [],
      peerComponents: [],
      imports: [],
      setup: [],
    };

    const npmRegex = /npm\s+install\s+([^\n]+)/gi;
    let match;
    while ((match = npmRegex.exec(text)) !== null) {
      const packages = match[1]
        .split(/\s+/)
        .filter((pkg) => pkg.startsWith("@") || !pkg.includes("-"));
      dependencies.npm.push(...packages);
    }

    const cdkComponents = [
      "@angular/cdk/a11y",
      "@angular/cdk/dialog",
      "@angular/cdk/overlay",
      "@angular/cdk/portal",
      "@angular/cdk/scrolling",
      "@angular/cdk/table",
    ];

    for (const cdkComponent of cdkComponents) {
      if (text.includes(cdkComponent)) {
        dependencies.angularCdk.push(cdkComponent);
      }
    }

    for (const otherComponent of KNOWN_COMPONENTS) {
      if (otherComponent !== componentName && text.toLowerCase().includes(otherComponent)) {
        dependencies.peerComponents.push(otherComponent);
      }
    }

    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/gi;
    match = null;
    while ((match = importRegex.exec(text)) !== null) {
      dependencies.imports.push({
        items: match[1].trim(),
        from: match[2].trim(),
      });
    }

    dependencies.setup = generateSetupInstructions(componentName, dependencies);

    if (includeTransitive) {
      dependencies.transitive = await getTransitiveDependencies(dependencies.peerComponents);
    }

    return dependencies;
  } catch (error) {
    console.error(`Error analyzing dependencies for ${componentName}:`, error);
    return {
      npm: [],
      angularCdk: [],
      peerComponents: [],
      imports: [],
      setup: [`Failed to analyze dependencies: ${(error as Error).message}`],
    };
  }
}

async function analyzeAccessibility(componentName: string, checkType: string) {
  try {
    const url = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
    const html = await fetchContent(url, "html", false);
    const text = htmlToText(html);

    const accessibility: Record<string, Record<string, string>> = {
      overview: {},
      aria: {},
      keyboard: {},
      screenreader: {},
      wcag: {},
    };

    const recommendations: string[] = [];

    if (checkType === "all" || checkType === "aria") {
      accessibility.aria = analyzeAriaSupport(text);
    }

    if (checkType === "all" || checkType === "keyboard") {
      accessibility.keyboard = analyzeKeyboardSupport(text);
    }

    if (checkType === "all" || checkType === "screenreader") {
      accessibility.screenreader = analyzeScreenReaderSupport(text);
    }

    if (checkType === "all" || checkType === "wcag") {
      accessibility.wcag = analyzeWcagCompliance(text);
    }

    recommendations.push(`Test ${componentName} with screen readers like NVDA or JAWS`);
    recommendations.push("Verify keyboard navigation works without mouse");
    recommendations.push("Check color contrast meets WCAG AA standards");
    recommendations.push("Ensure focus indicators are visible and clear");

    if (checkType === "all" || checkType === "overview") {
      const hasAria = Object.keys(accessibility.aria).length > 0;
      const hasKeyboard = Object.keys(accessibility.keyboard).length > 0;
      const hasScreenReader = Object.keys(accessibility.screenreader).length > 0;
      let score = 0;
      if (hasAria) score += 33;
      if (hasKeyboard) score += 33;
      if (hasScreenReader) score += 34;

      accessibility.overview = {
        score: `${score}%`,
        "ARIA Support": hasAria ? "Yes" : "Limited",
        "Keyboard Navigation": hasKeyboard ? "Yes" : "Limited",
        "Screen Reader": hasScreenReader ? "Yes" : "Limited",
      };
    }

    return { ...accessibility, recommendations };
  } catch (error) {
    console.error(`Error analyzing accessibility for ${componentName}:`, error);
    return {
      overview: {},
      aria: {},
      keyboard: {},
      screenreader: {},
      wcag: {},
      recommendations: [`Failed to analyze accessibility: ${(error as Error).message}`],
    };
  }
}

function generateSetupInstructions(componentName: string, dependencies: Dependencies): string[] {
  const instructions: string[] = [];
  if (dependencies.npm.length > 0) {
    instructions.push(`Install dependencies: npm install ${dependencies.npm.join(" ")}`);
  }
  instructions.push(`Install Spartan UI component: npx ng g @spartan-ng/cli:ui ${componentName}`);
  if (dependencies.imports.length > 0) {
    instructions.push("Add imports to your component:");
    dependencies.imports.forEach((imp) => {
      instructions.push(`  import { ${imp.items} } from '${imp.from}';`);
    });
  }
  return instructions;
}

async function getTransitiveDependencies(peerComponents: string[]) {
  const transitive: Array<{ component: string; dependencies: string[] }> = [];
  for (const component of peerComponents.slice(0, 3)) {
    try {
      const deps = await analyzeComponentDependencies(component, false);
      transitive.push({ component, dependencies: deps.peerComponents });
    } catch (error) {
      console.warn(`Failed to get transitive dependencies for ${component}:`, (error as Error).message);
    }
  }
  return transitive;
}

function analyzeAriaSupport(text: string): Record<string, string> {
  const features: Record<string, string> = {};
  for (const attr of ["aria-label", "aria-describedby", "aria-expanded", "aria-selected", "role"]) {
    if (text.includes(attr)) features[attr] = `${attr} support detected`;
  }
  return features;
}

function analyzeKeyboardSupport(text: string): Record<string, string> {
  const features: Record<string, string> = {};
  for (const term of ["keyboard", "focus", "tab", "enter", "space", "arrow keys"]) {
    if (text.toLowerCase().includes(term)) features[term] = `${term} navigation supported`;
  }
  return features;
}

function analyzeScreenReaderSupport(text: string): Record<string, string> {
  const features: Record<string, string> = {};
  if (text.includes("screen reader")) features.general = "Screen reader support mentioned";
  if (text.includes("announcements")) features.announcements = "Screen reader announcements supported";
  return features;
}

function analyzeWcagCompliance(text: string): Record<string, string> {
  const features: Record<string, string> = {};
  if (text.includes("WCAG")) features.compliance = "WCAG compliance mentioned";
  for (const criteria of ["contrast", "focus visible", "keyboard accessible"]) {
    if (text.toLowerCase().includes(criteria)) features[criteria] = `${criteria} support detected`;
  }
  return features;
}
