import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { warmCache } from './cache-warmup.js';
import { cacheManager } from './cache.js';
import { KNOWN_BLOCKS, KNOWN_COMPONENTS } from './utils.js';

export function registerCacheTools(server: McpServer): void {
	server.registerTool(
		'spartan_cache_status',
		{
			title: 'Get cache status',
			description: 'Get current cache status, including version, cached components, and statistics',
			inputSchema: {},
		},
		async () => {
			try {
				await cacheManager.initialize();
				const stats = await cacheManager.getStats();

				const summary = {
					currentVersion: stats.currentVersion,
					totalVersions: stats.totalVersions,
					versions: stats.versions,
					totalComponents: KNOWN_COMPONENTS.length,
					totalBlocks: KNOWN_BLOCKS.length,
				};

				return {
					content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: 'text',
							text: `Error getting cache status: ${(error as Error).message}`,
						},
					],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'spartan_cache_clear',
		{
			title: 'Clear cache',
			description: 'Clear cached documentation for the current Spartan UI version',
			inputSchema: {
				allVersions: z.boolean().optional().describe('Clear cache for all versions (default: false)'),
			},
		},
		async ({ allVersions }) => {
			try {
				await cacheManager.initialize();

				const result = allVersions ? await cacheManager.clearAll() : await cacheManager.clearVersion();

				return {
					content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: 'text',
							text: `Error clearing cache: ${(error as Error).message}`,
						},
					],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'spartan_cache_rebuild',
		{
			title: 'Rebuild cache',
			description: 'Rebuild cache by fetching fresh documentation from spartan.ng for all components and blocks',
			inputSchema: {
				components: z.array(z.string()).optional().describe('Specific components to rebuild (default: all components)'),
				blocks: z.array(z.string()).optional().describe('Specific blocks to rebuild (default: all blocks)'),
				includeDocs: z.boolean().optional().describe('Include documentation topics (default: true)'),
			},
		},
		async ({ components, blocks, includeDocs = true }) => {
			try {
				await cacheManager.initialize();
				await cacheManager.clearVersion();

				const results = await warmCache({
					components: components || KNOWN_COMPONENTS,
					blocks: blocks || KNOWN_BLOCKS,
					includeDocs,
					onProgress: (current, total) => {
						if (current % 5 === 0) {
							console.error(`Progress: ${current}/${total} items cached`);
						}
					},
				});

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(
								{
									success: true,
									version: results.version,
									components: {
										total: results.components.total,
										success: results.components.success,
										failed: results.components.failed,
									},
									blocks: {
										total: results.blocks.total,
										success: results.blocks.success,
										failed: results.blocks.failed,
									},
									docs: {
										total: results.docs.total,
										success: results.docs.success,
										failed: results.docs.failed,
									},
									duration: `${(results.duration / 1000).toFixed(2)}s`,
								},
								null,
								2,
							),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: 'text',
							text: `Error rebuilding cache: ${(error as Error).message}`,
						},
					],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'spartan_cache_switch_version',
		{
			title: 'Switch version',
			description: 'Switch to a different Spartan UI version for caching and retrieval',
			inputSchema: {
				version: z.string().describe("Spartan UI version (e.g., '1.2.3', 'latest')"),
			},
		},
		async ({ version }) => {
			try {
				const result = await cacheManager.switchVersion(version);
				return {
					content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: 'text',
							text: `Error switching version: ${(error as Error).message}`,
						},
					],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		'spartan_cache_list_versions',
		{
			title: 'List cached versions',
			description: 'List all cached Spartan UI versions',
			inputSchema: {},
		},
		async () => {
			try {
				await cacheManager.initialize();
				const versions = await cacheManager.listVersions();
				return {
					content: [{ type: 'text', text: JSON.stringify(versions, null, 2) }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: 'text',
							text: `Error listing versions: ${(error as Error).message}`,
						},
					],
					isError: true,
				};
			}
		},
	);
}
