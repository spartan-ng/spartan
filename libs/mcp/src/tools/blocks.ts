import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { cacheManager } from './cache.js';
import {
	KNOWN_BLOCKS,
	KNOWN_COMPONENTS,
	SPARTAN_BLOCKS_BASE,
	extractCodeBlocks,
	fetchContent,
	htmlToText,
} from './utils.js';

export function registerBlockTools(server: McpServer): void {
	server.registerTool(
		'spartan_blocks_list',
		{
			title: 'List Spartan UI blocks',
			description:
				'Returns a list of known Spartan Angular UI blocks (pre-built UI patterns) with their documentation URLs. ' +
				'Blocks are higher-level compositions of components like sidebars, login forms, signup forms, and calendars. ' +
				'Use this to discover available blocks, then call spartan_blocks_get with specific block names to get detailed code.',
			inputSchema: {},
		},
		async () => {
			const items = KNOWN_BLOCKS.map((name) => ({
				name,
				url: `${SPARTAN_BLOCKS_BASE}/${name}`,
			}));
			const responseText =
				JSON.stringify({ blocks: items }, null, 2) +
				'\n\nPROCESSING INSTRUCTIONS:\n' +
				'- This list contains all available Spartan UI blocks\n' +
				'- Use spartan_blocks_get with any block name to get detailed code and documentation\n' +
				'- Blocks are pre-built UI patterns composed of multiple components\n' +
				'- Always present block code and dependencies when helping users';
			return {
				content: [{ type: 'text', text: responseText }],
			};
		},
	);

	server.registerTool(
		'spartan_blocks_get',
		{
			title: 'Get block documentation and code',
			description:
				"Fetch the Spartan UI documentation page for a given block (e.g., 'sidebar', 'login'). " +
				'Blocks are pre-built UI patterns that combine multiple components. ' +
				'The response includes complete code examples showing how to use the block.',
			inputSchema: {
				name: z
					.string()
					.min(1, 'name is required')
					.describe("Block name (kebab-case), e.g., 'sidebar', 'login', 'signup', 'calendar'."),
				format: z.enum(['html', 'text']).default('html').describe('Return format: raw HTML or plain text.'),
				noCache: z.boolean().default(false).describe('Bypass cache when true.'),
				spartanVersion: z
					.string()
					.optional()
					.describe("Spartan UI version to use for caching (e.g., '1.2.3'). If not provided, defaults to 'latest'."),
			},
		},
		async (args) => {
			const name = String(args.name || '')
				.trim()
				.toLowerCase();
			if (!name) throw new Error('Missing block name');
			if (!KNOWN_BLOCKS.includes(name)) {
				throw new Error(`Unknown block: ${name}. Available: ${KNOWN_BLOCKS.join(', ')}`);
			}

			await cacheManager.initialize(args.spartanVersion);

			const url = `${SPARTAN_BLOCKS_BASE}/${encodeURIComponent(name)}`;
			const format = args.format === 'text' ? 'text' : 'html';
			const noCache = Boolean(args.noCache);

			// Cache HTML as the single canonical entry; text is derived on read so the
			// two formats can never drift for the same block/version.
			const cacheKey = `${name}__html`;
			let html: string;
			let cacheInfo = '';

			if (!noCache) {
				const cached = await cacheManager.getBlock(cacheKey);
				if (cached.cached && !cached.stale) {
					html = (cached.data as { html: string }).html;
					cacheInfo = `\n[CACHED DATA - Version: ${cached.version}, Cached at: ${cached.cachedAt}]`;
				} else {
					html = await fetchContent(url, 'html', true);
					const extracted = extractCodeBlocks(html);
					await cacheManager.setBlock(cacheKey, {
						html,
						code: extracted,
						full: { html, code: extracted, url },
					});
					cacheInfo = cached.cached
						? `\n[CACHE REFRESHED - Version: ${cacheManager.currentVersion}]`
						: `\n[NEWLY CACHED - Version: ${cacheManager.currentVersion}]`;
				}
			} else {
				html = await fetchContent(url, 'html', true);
				cacheInfo = '\n[LIVE FETCH - Cache bypassed]';
			}

			const content = format === 'text' ? htmlToText(html) : html;

			const responseText =
				`${content}${cacheInfo}\n\nSource: ${url}\n\n` +
				'PROCESSING INSTRUCTIONS:\n' +
				'- This response contains block documentation and code examples\n' +
				'- Blocks are pre-built UI patterns using Spartan components\n' +
				'- Present the complete code examples for the block\n' +
				'- List the required components and dependencies\n' +
				'- Show how to integrate the block into an Angular application';

			return {
				content: [{ type: 'text', text: responseText }],
			};
		},
	);

	server.registerTool(
		'spartan_blocks_dependencies',
		{
			title: 'Show block dependencies',
			description:
				'Analyze what components and packages a Spartan UI block requires. ' +
				'Blocks are compositions of multiple components, so this shows all underlying dependencies.',
			inputSchema: {
				blockName: z.string().min(1, 'blockName is required').describe("Spartan block name (e.g., 'sidebar', 'login')"),
			},
		},
		async (args) => {
			const blockName = String(args.blockName || '')
				.trim()
				.toLowerCase();
			if (!KNOWN_BLOCKS.includes(blockName)) {
				throw new Error(`Unknown block: ${blockName}. Available: ${KNOWN_BLOCKS.join(', ')}`);
			}

			const url = `${SPARTAN_BLOCKS_BASE}/${blockName}`;
			const html = await fetchContent(url, 'html', false);
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

			// Derive referenced Spartan components from `@spartan-ng/{brain,helm}/...`
			// import paths in the page's code examples. Matching the full page text
			// would match the docs navigation sidebar, which lists every component.
			const importedComponents = new Set<string>();
			const importRegex = /@spartan-ng\/(?:brain|helm)\/([\w-]+)/g;
			let importMatch: RegExpExecArray | null;
			while ((importMatch = importRegex.exec(text)) !== null) {
				importedComponents.add(importMatch[1]);
			}
			for (const component of KNOWN_COMPONENTS) {
				if (importedComponents.has(component)) {
					dependencies.spartanComponents.push(component);
				}
			}

			// Find npm packages
			const npmRegex = /npm\s+install\s+([^\n]+)/gi;
			let match;
			while ((match = npmRegex.exec(text)) !== null) {
				const packages = match[1]
					.split(/\s+/)
					.filter((pkg) => pkg.length > 0 && !pkg.startsWith('-'))
					.map((pkg) => pkg.replace(/[,;]$/, ''));
				dependencies.npmPackages.push(...packages);
			}

			// Find Angular CDK references
			const cdkComponents = [
				'@angular/cdk/a11y',
				'@angular/cdk/dialog',
				'@angular/cdk/overlay',
				'@angular/cdk/portal',
				'@angular/cdk/scrolling',
			];
			for (const cdk of cdkComponents) {
				if (text.includes(cdk)) dependencies.angularCdk.push(cdk);
			}

			return {
				content: [
					{
						type: 'text',
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
									'Present dependencies with installation commands and setup instructions. Show which Spartan components are used in this block.',
							},
							null,
							2,
						),
					},
				],
			};
		},
	);
}
