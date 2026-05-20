// Base URLs for Spartan UI docs
export const SPARTAN_DOCS_BASE = "https://www.spartan.ng/documentation";
export const SPARTAN_COMPONENTS_BASE = "https://www.spartan.ng/components";
export const SPARTAN_BLOCKS_BASE = "https://www.spartan.ng/blocks";

/**
 * Known Spartan components (from docs navigation). Keep this list updated.
 * Some entries may be marked as "soon" on the site.
 */
export const KNOWN_COMPONENTS: string[] = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "empty",
  "field",
  "form-field",
  "hover-card",
  "icon",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
];

/**
 * Known Spartan blocks (pre-built UI patterns).
 */
export const KNOWN_BLOCKS: string[] = [
  "sidebar",
  "login",
  "signup",
  "calendar",
];

/**
 * Known documentation topics.
 */
export const DOCUMENTATION_TOPICS: string[] = [
  "installation",
  "cli",
  "theming",
  "dark-mode",
  "typography",
  "health-checks",
  "update-guide",
];

/**
 * Minimal HTML -> text converter for callers that want plain text.
 */
export function htmlToText(html: string): string {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const withBreaks = withoutStyles
    .replace(/<\/(p|div|section|article|li|h[1-6]|br|pre)>/gi, "\n")
    .replace(/<(br|hr)\s*\/>/gi, "\n");
  const stripped = withBreaks.replace(/<[^>]+>/g, "");
  const decoded = stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return decoded.replace(/\n{3,}/g, "\n\n").trim();
}

interface CacheEntry {
  content: string;
  timestampMs: number;
}

/**
 * Simple in-memory cache for fetched pages.
 */
const responseCache = new Map<string, CacheEntry>();

/**
 * Fetch a URL and return HTML or text with basic caching.
 */
export async function fetchContent(
  url: string,
  format: "html" | "text" = "html",
  noCache = false
): Promise<string> {
  const ttlMs = Number(process.env.SPARTAN_CACHE_TTL_MS || 5 * 60 * 1000);
  const cacheKey = `${url}::${format}`;
  const now = Date.now();
  if (!noCache && responseCache.has(cacheKey)) {
    const entry = responseCache.get(cacheKey)!;
    if (now - entry.timestampMs < ttlMs) {
      return entry.content;
    }
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "spartan-ui-mcp/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();
  const result = format === "text" ? htmlToText(html) : html;
  if (!noCache) {
    responseCache.set(cacheKey, { content: result, timestampMs: now });
  }
  return result;
}

/**
 * Represents a formatted code block extracted from documentation.
 */
export interface CodeBlock {
  code: string;
  language: string;
  title: string;
  id: string;
}

/**
 * Detect language from code content and HTML attributes.
 */
function detectLanguageFromContext(code: string, preTag: string): string {
  // Check HTML class attribute first (e.g., <code class="language-typescript">)
  const langMatch = preTag.match(/language-(\w+)/i) || preTag.match(/lang-(\w+)/i);
  if (langMatch) {
    const lang = langMatch[1].toLowerCase();
    if (["typescript", "javascript", "html", "css", "bash", "json", "shell"].includes(lang)) {
      return lang;
    }
  }

  return detectLanguage(code);
}

/**
 * Extract a title from the code block's HTML context (e.g., preceding heading).
 */
function extractTitleFromContext(html: string, matchIndex: number): string {
  // Look for a heading before this code block
  const beforeCode = html.slice(Math.max(0, matchIndex - 1000), matchIndex);
  const headingMatch = beforeCode.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>\s*$/i);
  if (headingMatch) {
    return htmlToText(headingMatch[1]).trim();
  }

  // Look for a caption or label
  const captionMatch = beforeCode.match(/<(caption|summary|label)[^>]*>([^<]+)<\/\1>\s*$/i);
  if (captionMatch) {
    return htmlToText(captionMatch[2]).trim();
  }

  return "";
}

/**
 * Remove common leading whitespace from code (like ES6 dedent).
 */
function dedent(code: string): string {
  const lines = code.split("\n");

  // Find minimum indentation (ignoring empty lines)
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^(\s*)/);
    if (match) {
      minIndent = Math.min(minIndent, match[1].length);
    }
  }

  if (minIndent === Infinity || minIndent === 0) {
    return code;
  }

  // Remove common indentation
  return lines
    .map((line) => (line.trim().length > 0 ? line.slice(minIndent) : line))
    .join("\n")
    .trim();
}

/**
 * Clean up code: fix HTML entities, normalize line endings, dedent.
 */
function cleanCode(raw: string): string {
  let code = raw;

  // Normalize line endings
  code = code.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Fix HTML entities that might remain
  code = code
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Remove trailing whitespace on each line
  code = code
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  // Remove leading/trailing blank lines
  code = code.replace(/^\n+/, "").replace(/\n+$/, "");

  // Dedent
  code = dedent(code);

  // Collapse excessive blank lines (max 1 consecutive)
  code = code.replace(/\n{3,}/g, "\n\n");

  return code;
}

/**
 * Generate an ID from code content for deduplication.
 */
function generateCodeId(code: string): string {
  // Use first 200 chars + length as a simple hash
  const snippet = code.slice(0, 200).replace(/\s+/g, "");
  return `${snippet.length}-${code.length}`;
}

/**
 * Extract code blocks from HTML and return as an array of CodeBlock objects.
 */
export function extractCodeBlocks(html: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const seenIds = new Set<string>();

  // Match <pre><code> blocks with position tracking
  const preCodeRegex = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi;
  let match;

  while ((match = preCodeRegex.exec(html)) !== null) {
    const preTag = match[0].slice(0, match[0].indexOf(">") + 1);
    const rawInner = match[1];

    // Strip nested HTML tags (like syntax highlighting spans) but keep text
    const strippedInner = rawInner.replace(/<[^>]+>/g, "");

    const rawCode = htmlToText(strippedInner);
    const lines = rawCode.split("\n").filter((line) => line.trim().length > 0);

    // Skip very short blocks (single imports, snippets)
    if (lines.length < 3) continue;

    const code = cleanCode(rawCode);
    if (code.length < 20) continue;

    const id = generateCodeId(code);
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const language = detectLanguageFromContext(rawCode, preTag);
    const title = extractTitleFromContext(html, match.index);

    blocks.push({ code, language, title, id });
  }

  return blocks;
}

/**
 * Extract headings (h1-h3) and return as plain text in order.
 */
export function extractHeadings(html: string): string[] {
  const regex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) headings.push(htmlToText(match[2]));
  return headings;
}

/**
 * Extract links: { text, href }
 */
export interface ExtractedLink {
  href: string;
  text: string;
}

export function extractLinks(html: string): ExtractedLink[] {
  const regex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links: ExtractedLink[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push({ href: match[1], text: htmlToText(match[2]) });
  }
  return links;
}

// --- API extraction types ---

export interface APIInput {
  prop: string;
  type: string;
  default: string;
  description: string;
}

export interface APIOutput {
  prop: string;
  type: string;
  description: string;
}

export interface APIComponent {
  name: string;
  selector: string;
  inputs: APIInput[];
  outputs: APIOutput[];
}

export interface APIExample {
  title: string;
  code: string;
  language: string;
}

export interface APIInfo {
  brainAPI: APIComponent[];
  helmAPI: APIComponent[];
  examples: APIExample[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeInlineWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

interface HeadingMatch {
  text: string;
  start: number;
  end: number;
}

function getHeadingMatches(html: string): HeadingMatch[] {
  const matches: HeadingMatch[] = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    matches.push({
      text: normalizeInlineWhitespace(htmlToText(match[2])),
      start: match.index,
      end: regex.lastIndex,
    });
  }

  return matches;
}

function extractSectionContent(
  html: string,
  heading: string,
  stopHeadings: string[],
): string | null {
  const headings = getHeadingMatches(html);
  const startHeading = headings.find((item) => item.text === heading);

  if (!startHeading) {
    return null;
  }

  const stopHeading = headings.find(
    (item) =>
      item.start > startHeading.start && stopHeadings.includes(item.text),
  );

  return html.slice(startHeading.end, stopHeading?.start ?? html.length);
}

function buildAPIExamples(html: string): APIExample[] {
  return extractCodeBlocks(html).slice(0, 10).map((block, index) => ({
    title: block.title || `Example ${index + 1}`,
    code: block.code,
    language: block.language,
  }));
}

/**
 * Extract structured API information from component documentation
 */
export function extractAPIInfo(html: string): APIInfo {
  const apiInfo: APIInfo = {
    brainAPI: [],
    helmAPI: [],
    examples: [],
  };

  try {
    const brainAPISection = extractSectionContent(html, "Brain API", [
      "Helm API",
      "On this page",
    ]);
    const helmAPISection = extractSectionContent(html, "Helm API", [
      "On this page",
    ]);

    if (brainAPISection) {
      apiInfo.brainAPI = extractAPIComponents(brainAPISection);
    }

    if (helmAPISection) {
      apiInfo.helmAPI = extractAPIComponents(helmAPISection);
    }

    apiInfo.examples = buildAPIExamples(html);
  } catch (error) {
    console.error("Error extracting API info:", error);
  }

  return apiInfo;
}

function extractAPIComponents(html: string): APIComponent[] {
  const componentHeadings = getHeadingMatches(html).filter((item) =>
    /^(Brn|Hlm)\w+$/.test(item.text),
  );

  if (componentHeadings.length === 0) {
    return extractAPIComponentsFromText(htmlToText(html));
  }

  return componentHeadings.map((heading, index) => {
    const nextHeading = componentHeadings[index + 1];
    const content = html.slice(heading.end, nextHeading?.start ?? html.length);

    return {
      name: heading.text,
      selector: extractSelector(content),
      inputs: extractInputsFromTable(content),
      outputs: extractOutputsFromTable(content),
    };
  });
}

function extractInputsFromTable(html: string): APIInput[] {
  const props: APIInput[] = [];

  const tableSection = extractSectionContent(html, "Inputs", ["Outputs"]);
  if (!tableSection) return extractInputsFromText(htmlToText(html));
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  let isHeaderRow = true;

  while ((rowMatch = rowRegex.exec(tableSection)) !== null) {
    const rowContent = rowMatch[1];

    if (isHeaderRow) {
      isHeaderRow = false;
      continue;
    }

    const cells: string[] = [];
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      cells.push(htmlToText(cellMatch[1]).trim());
    }

    if (cells.length >= 3) {
      props.push({
        prop: cells[0],
        type: cells[1],
        default: cells[2],
        description: cells[3] || "",
      });
    }
  }

  return props.length > 0
    ? props
    : extractInputRowsFromSectionText(htmlToText(tableSection))
        .map(parseInputRow)
        .filter((row): row is APIInput => row !== null);
}

function extractOutputsFromTable(html: string): APIOutput[] {
  const props: APIOutput[] = [];

  const tableSection = extractSectionContent(html, "Outputs", []);
  if (!tableSection) return extractOutputsFromText(htmlToText(html));
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  let isHeaderRow = true;

  while ((rowMatch = rowRegex.exec(tableSection)) !== null) {
    const rowContent = rowMatch[1];

    if (isHeaderRow) {
      isHeaderRow = false;
      continue;
    }

    const cells: string[] = [];
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      cells.push(htmlToText(cellMatch[1]).trim());
    }

    if (cells.length >= 3) {
      props.push({
        prop: cells[0],
        type: cells[1],
        description: (cells.length >= 4 ? cells.slice(3) : cells.slice(2))
          .join(" ")
          .trim(),
      });
    }
  }

  return props.length > 0
    ? props
    : extractInputRowsFromSectionText(htmlToText(tableSection))
        .map(parseOutputRow)
        .filter((row): row is APIOutput => row !== null);
}

function extractSelector(html: string): string {
  const selectorMatch = htmlToText(html).match(/Selector:\s*([^\n]+)/i);
  return selectorMatch ? selectorMatch[1].replace(/`/g, "").trim() : "";
}

function extractAPIComponentsFromText(text: string): APIComponent[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const components: APIComponent[] = [];
  let currentName: string | null = null;
  let currentBlock: string[] = [];

  const flush = () => {
    if (!currentName) {
      return;
    }

    const blockText = currentBlock.join("\n");
    components.push({
      name: currentName,
      selector: extractSelector(blockText),
      inputs: extractInputsFromText(blockText),
      outputs: extractOutputsFromText(blockText),
    });
  };

  for (const line of lines) {
    if (/^(Brn|Hlm)\w+$/.test(line)) {
      flush();
      currentName = line;
      currentBlock = [];
      continue;
    }

    if (currentName) {
      currentBlock.push(line);
    }
  }

  flush();
  return components;
}

function extractInputsFromText(text: string): APIInput[] {
  const rows = extractSectionRows(text, "Inputs", "Outputs");

  return rows
    .map(parseInputRow)
    .filter((row): row is APIInput => row !== null);
}

function extractOutputsFromText(text: string): APIOutput[] {
  const rows = extractSectionRows(text, "Outputs");

  return rows
    .map(parseOutputRow)
    .filter((row): row is APIOutput => row !== null);
}

function parseInputRow(row: string): APIInput | null {
  const wideParts = row.split(/\s{2,}/).map((part) => part.trim());
  if (wideParts.length >= 4) {
    const [prop, type, defaultValue, ...description] = wideParts;
    return {
      prop,
      type,
      default: defaultValue,
      description: description.join(" ").trim(),
    };
  }

  const compactMatch = row.match(
    /^(\S+)\s+(.+?)\s+(-|true|false|null|undefined|\d+(?:\.\d+)?|["'][^"']*["'])\s+(.+)$/,
  );
  if (!compactMatch) {
    return null;
  }

  return {
    prop: compactMatch[1],
    type: compactMatch[2],
    default: compactMatch[3],
    description: compactMatch[4].trim(),
  };
}

function parseOutputRow(row: string): APIOutput | null {
  const wideParts = row.split(/\s{2,}/).map((part) => part.trim());
  if (wideParts.length >= 4) {
    return {
      prop: wideParts[0],
      type: wideParts[1],
      description: wideParts.slice(3).join(" ").trim(),
    };
  }

  if (wideParts.length === 3) {
    return {
      prop: wideParts[0],
      type: wideParts[1],
      description: wideParts[2],
    };
  }

  const compactMatch = row.match(
    /^(\S+)\s+(.+?)\s+(-|true|false|null|undefined|\d+(?:\.\d+)?|["'][^"']*["'])\s+(.+)$/,
  );
  if (!compactMatch) {
    return null;
  }

  return {
    prop: compactMatch[1],
    type: compactMatch[2],
    description: compactMatch[4].trim(),
  };
}

function extractSectionRows(
  text: string,
  heading: string,
  stopHeading?: string,
): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const startIndex = lines.findIndex((line) => line === heading);

  if (startIndex === -1) {
    return [];
  }

  const rows: string[] = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (stopHeading && line === stopHeading) {
      break;
    }

    if (/^(Brn|Hlm)\w+$/.test(line)) {
      break;
    }

    if (/^Prop\s+Type/i.test(line)) {
      continue;
    }

    rows.push(line);
  }

  return rows;
}

function extractInputRowsFromSectionText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^Prop\s+Type/i.test(line));
}

/**
 * Simple language detection based on code content
 */
export function detectLanguage(code: string): string {
  if (code.includes("import") && code.includes("Component")) {
    return "typescript";
  }
  if (code.includes("import") && code.includes("from")) {
    return "javascript";
  }
  if (code.includes("<") && code.includes(">") && code.includes("hlm")) {
    return "html";
  }
  if (code.includes("npm") || code.includes("npx") || code.includes("ng ")) {
    return "bash";
  }
  return "typescript";
}
