import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
	DOCUMENTATION_TOPICS,
	KNOWN_BLOCKS,
	KNOWN_COMPONENTS,
	SPARTAN_BLOCKS_BASE,
	SPARTAN_COMPONENTS_BASE,
	SPARTAN_DOCS_BASE,
} from './utils.js';

export function registerMetaTools(server: McpServer): void {
	server.registerTool(
		'spartan_meta',
		{
			title: 'Spartan metadata',
			description: 'Return known docs topics, components, and blocks for client autocomplete.',
			inputSchema: {},
		},
		async () => {
			const responseData = {
				topics: [...DOCUMENTATION_TOPICS, 'analog-dark-mode'].map((t) => ({
					topic: t,
					url:
						t === 'analog-dark-mode'
							? 'https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049'
							: `${SPARTAN_DOCS_BASE}/${t}`,
				})),
				components: KNOWN_COMPONENTS.map((n) => ({
					name: n,
					url: `${SPARTAN_COMPONENTS_BASE}/${n}`,
				})),
				blocks: KNOWN_BLOCKS.map((n) => ({
					name: n,
					url: `${SPARTAN_BLOCKS_BASE}/${n}`,
				})),
				usage: {
					spartan_docs_get: 'Fetch documentation topics',
					spartan_components_get: "Fetch component APIs with extract='api' for structured data",
					spartan_components_list: 'List all available components',
					spartan_blocks_list: 'List all available blocks',
					spartan_blocks_get: 'Fetch block documentation and code',
				},
			};
			const responseText =
				JSON.stringify(responseData, null, 2) +
				'\n\nPROCESSING INSTRUCTIONS:\n' +
				'- Use this metadata to understand available topics, components, and blocks\n' +
				"- Always fetch component documentation with extract='api' for structured API data\n" +
				'- Include code examples and usage patterns in your responses\n' +
				'- Blocks are pre-built UI patterns composed of multiple components';
			return {
				content: [
					{
						type: 'text',
						text: responseText,
					},
				],
			};
		},
	);
}
