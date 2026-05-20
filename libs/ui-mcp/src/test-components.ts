import {
  KNOWN_COMPONENTS,
  SPARTAN_COMPONENTS_BASE,
  fetchContent,
  extractCodeBlocks,
  extractAPIInfo,
} from "./tools/utils.js";

console.log("=== Testing spartan_components_list ===\n");
const items = KNOWN_COMPONENTS.map((name) => ({
  name,
  url: `${SPARTAN_COMPONENTS_BASE}/${name}`,
}));
console.log(JSON.stringify({ components: items }, null, 2));

console.log("\n\n=== Testing spartan_components_get (name: button) ===\n");
const url = `${SPARTAN_COMPONENTS_BASE}/button`;
const html = await fetchContent(url, "html", true);
const api = extractAPIInfo(html);
const codeBlocks = extractCodeBlocks(html);

console.log(`API Info: ${api.brainAPI.length} Brain API, ${api.helmAPI.length} Helm API`);
console.log(`Code Blocks: ${codeBlocks.length} extracted\n`);

for (const block of codeBlocks.slice(0, 3)) {
  console.log("─".repeat(60));
  console.log(`Title: ${block.title || "(untitled)"}`);
  console.log(`Language: ${block.language}`);
  console.log(`ID: ${block.id}`);
  console.log("─".repeat(60));
  console.log(block.code);
  console.log("\n");
}
