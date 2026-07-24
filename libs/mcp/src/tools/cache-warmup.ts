import { pathToFileURL } from 'url';
import { cacheManager } from './cache.js';
import {
	DOCUMENTATION_TOPICS,
	extractAPIInfo,
	extractCodeBlocks,
	fetchContent,
	KNOWN_BLOCKS,
	KNOWN_COMPONENTS,
	SPARTAN_BLOCKS_BASE,
	SPARTAN_COMPONENTS_BASE,
	SPARTAN_DOCS_BASE,
} from './utils.js';

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

async function warmComponent(componentName: string): Promise<{ success: boolean; component: string; error?: string }> {
	try {
		console.error(`  Caching ${componentName}...`);
		const url = `${SPARTAN_COMPONENTS_BASE}/${componentName}`;
		const html = await fetchContent(url, 'html', true);
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

async function warmBlock(blockName: string): Promise<{ success: boolean; block: string; error?: string }> {
	try {
		console.error(`  Caching block: ${blockName}...`);
		const url = `${SPARTAN_BLOCKS_BASE}/${blockName}`;
		const html = await fetchContent(url, 'html', true);
		const code = extractCodeBlocks(html);

		await cacheManager.setBlock(`${blockName}__html`, {
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
		console.error(`  Caching docs: ${topic}...`);
		const url = `${SPARTAN_DOCS_BASE}/${topic}`;
		const html = await fetchContent(url, 'html', true);
		await cacheManager.setDocs(topic, html);
		return { success: true, topic };
	} catch (error) {
		console.error(`  Failed to cache ${topic}: ${(error as Error).message}`);
		return { success: false, topic, error: (error as Error).message };
	}
}

export async function warmCache(options: WarmupOptions = {}): Promise<WarmupResult> {
	const { components = KNOWN_COMPONENTS, blocks = KNOWN_BLOCKS, includeDocs = true, onProgress = undefined } = options;

	const startTime = Date.now();
	const results: WarmupResult = {
		version: cacheManager.currentVersion,
		components: { total: components.length, success: 0, failed: 0, errors: [] },
		blocks: { total: blocks.length, success: 0, failed: 0, errors: [] },
		docs: { total: includeDocs ? DOCUMENTATION_TOPICS.length : 0, success: 0, failed: 0, errors: [] },
		duration: 0,
	};

	console.error(`\nWarming cache for Spartan UI v${results.version}\n`);
	console.error(`Components: ${components.length}`);
	console.error(`Blocks: ${blocks.length}`);
	if (includeDocs) console.error(`Documentation topics: ${DOCUMENTATION_TOPICS.length}`);
	console.error('');

	let progress = 0;
	const total = components.length + blocks.length + (includeDocs ? DOCUMENTATION_TOPICS.length : 0);

	// Cache components
	console.error('Caching Components...');
	for (const component of components) {
		const result = await warmComponent(component);
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
	console.error('\nCaching Blocks...');
	for (const block of blocks) {
		const result = await warmBlock(block);
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
		console.error('\nCaching Documentation...');
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

	console.error('\n' + '='.repeat(60));
	console.error('CACHE WARMUP COMPLETE\n');
	console.error(`Version: ${results.version}`);
	console.error(`Duration: ${(results.duration / 1000).toFixed(2)}s\n`);
	console.error(`Components: ${results.components.success}/${results.components.total} successful`);
	console.error(`Blocks: ${results.blocks.success}/${results.blocks.total} successful`);
	if (includeDocs) console.error(`Documentation: ${results.docs.success}/${results.docs.total} successful`);
	console.error('='.repeat(60));

	return results;
}

export async function runCacheWarmup(): Promise<WarmupResult> {
	const version = await cacheManager.initialize();
	console.error(`Using Spartan UI version: ${version}`);

	return warmCache({
		components: KNOWN_COMPONENTS,
		blocks: KNOWN_BLOCKS,
		includeDocs: true,
	});
}

// Run as a CLI only when invoked directly. `process.argv[1]` is undefined when
// imported, in a REPL, or under `node -e`, so guard before resolving it.
const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
	runCacheWarmup()
		.then((results) => {
			const failed = results.components.failed + results.blocks.failed + results.docs.failed;
			process.exit(failed > 0 ? 1 : 0);
		})
		.catch((error) => {
			console.error('Cache warmup failed:', (error as Error).message);
			console.error((error as Error).stack);
			process.exit(1);
		});
}
