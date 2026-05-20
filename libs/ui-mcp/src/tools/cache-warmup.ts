import { cacheManager } from "./cache.js";
import {
  fetchContent,
  extractCodeBlocks,
  extractAPIInfo,
  KNOWN_COMPONENTS,
  KNOWN_BLOCKS,
  DOCUMENTATION_TOPICS,
  SPARTAN_COMPONENTS_BASE,
  SPARTAN_BLOCKS_BASE,
  SPARTAN_DOCS_BASE,
} from "./utils.js";

interface WarmupOptions {
  components?: string[];
  blocks?: string[];
  includeDocs?: boolean;
  onProgress?: (current: number, total: number) => void;
}

interface WarmupResult {
  version: string | null;
  components: { total: number; success: number; failed: number; errors: Array<{ component: string; error: string }> };
  blocks: { total: number; success: number; failed: number; errors: Array<{ block: string; error: string }> };
  docs: { total: number; success: number; failed: number; errors: Array<{ topic: string; error: string }> };
  duration: number;
}

async function warmComponent(componentName: string, version: string): Promise<{ success: boolean; component: string; error?: string }> {
  try {
    console.log(`  Caching ${componentName}...`);
    const url = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
    const html = await fetchContent(url, "html", true);
    const api = extractAPIInfo(html);
    const examples = extractCodeBlocks(html);

    await cacheManager.setComponent(componentName, {
      html,
      api,
      examples,
      full: { html, api, examples, url },
    });

    return { success: true, component: componentName };
  } catch (error) {
    console.error(`  Failed to cache ${componentName}: ${(error as Error).message}`);
    return { success: false, component: componentName, error: (error as Error).message };
  }
}

async function warmBlock(blockName: string, version: string): Promise<{ success: boolean; block: string; error?: string }> {
  try {
    console.log(`  Caching block: ${blockName}...`);
    const url = `${SPARTAN_BLOCKS_BASE}/${blockName}`;
    const html = await fetchContent(url, "html", true);
    const code = extractCodeBlocks(html);

    await cacheManager.setBlock(blockName, {
      html,
      code,
      full: { html, code, url },
    });

    return { success: true, block: blockName };
  } catch (error) {
    console.error(`  Failed to cache block ${blockName}: ${(error as Error).message}`);
    return { success: false, block: blockName, error: (error as Error).message };
  }
}

async function warmDocs(topic: string): Promise<{ success: boolean; topic: string; error?: string }> {
  try {
    console.log(`  Caching docs: ${topic}...`);
    const url = `${SPARTAN_DOCS_BASE}/${topic}`;
    const html = await fetchContent(url, "html", true);
    await cacheManager.setDocs(topic, html);
    return { success: true, topic };
  } catch (error) {
    console.error(`  Failed to cache ${topic}: ${(error as Error).message}`);
    return { success: false, topic, error: (error as Error).message };
  }
}

export async function warmCache(options: WarmupOptions = {}): Promise<WarmupResult> {
  const {
    components = KNOWN_COMPONENTS,
    blocks = KNOWN_BLOCKS,
    includeDocs = true,
    onProgress = null,
  } = options;

  const startTime = Date.now();
  const results: WarmupResult = {
    version: cacheManager.currentVersion,
    components: { total: components.length, success: 0, failed: 0, errors: [] },
    blocks: { total: blocks.length, success: 0, failed: 0, errors: [] },
    docs: { total: includeDocs ? DOCUMENTATION_TOPICS.length : 0, success: 0, failed: 0, errors: [] },
    duration: 0,
  };

  console.log(`\nWarming cache for Spartan UI v${results.version}\n`);
  console.log(`Components: ${components.length}`);
  console.log(`Blocks: ${blocks.length}`);
  if (includeDocs) console.log(`Documentation topics: ${DOCUMENTATION_TOPICS.length}`);
  console.log("");

  let progress = 0;
  const total = components.length + blocks.length + (includeDocs ? DOCUMENTATION_TOPICS.length : 0);

  // Cache components
  console.log("Caching Components...");
  for (const component of components) {
    const result = await warmComponent(component, results.version!);
    if (result.success) results.components.success++;
    else {
      results.components.failed++;
      results.components.errors.push({ component, error: result.error! });
    }
    progress++;
    if (onProgress) onProgress(progress, total);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Cache blocks
  console.log("\nCaching Blocks...");
  for (const block of blocks) {
    const result = await warmBlock(block, results.version!);
    if (result.success) results.blocks.success++;
    else {
      results.blocks.failed++;
      results.blocks.errors.push({ block, error: result.error! });
    }
    progress++;
    if (onProgress) onProgress(progress, total);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Cache documentation
  if (includeDocs) {
    console.log("\nCaching Documentation...");
    for (const topic of DOCUMENTATION_TOPICS) {
      const result = await warmDocs(topic);
      if (result.success) results.docs.success++;
      else {
        results.docs.failed++;
        results.docs.errors.push({ topic, error: result.error! });
      }
      progress++;
      if (onProgress) onProgress(progress, total);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  results.duration = Date.now() - startTime;

  console.log("\n" + "=".repeat(60));
  console.log("CACHE WARMUP COMPLETE\n");
  console.log(`Version: ${results.version}`);
  console.log(`Duration: ${(results.duration / 1000).toFixed(2)}s\n`);
  console.log(`Components: ${results.components.success}/${results.components.total} successful`);
  console.log(`Blocks: ${results.blocks.success}/${results.blocks.total} successful`);
  if (includeDocs) console.log(`Documentation: ${results.docs.success}/${results.docs.total} successful`);
  console.log("=".repeat(60));

  return results;
}

export async function runCacheWarmup(): Promise<void> {
  try {
    const version = await cacheManager.initialize();
    console.log(`Using Spartan UI version: ${version}`);

    await warmCache({
      components: KNOWN_COMPONENTS,
      blocks: KNOWN_BLOCKS,
      includeDocs: true,
    });

    process.exit(0);
  } catch (error) {
    console.error("Cache warmup failed:", (error as Error).message);
    console.error((error as Error).stack);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCacheWarmup();
}
