#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAnalysisTools } from './tools/analysis.js';
import { registerBlockTools } from './tools/blocks.js';
import { registerCacheTools } from './tools/cache-tools.js';
import { registerComponentTools } from './tools/components.js';
import { registerDocsTools } from './tools/docs.js';
import { registerHealthTools } from './tools/health.js';
import { registerMetaTools } from './tools/meta.js';
import { registerPromptHandlers } from './tools/prompts.js';
import { registerResourceHandlers } from './tools/resources.js';

const server = new McpServer({
	name: 'spartan-ui',
	version: '0.0.1',
	description: 'MCP server exposing Spartan Angular UI documentation, component tools, and blocks.',
});

// Register tool modules
registerComponentTools(server);
registerDocsTools(server);
registerHealthTools(server);
registerMetaTools(server);
registerAnalysisTools(server);
registerCacheTools(server);
registerBlockTools(server);

// Register resource handlers
registerResourceHandlers(server);

// Register prompt handlers
registerPromptHandlers(server);

const transport = new StdioServerTransport();

await server.connect(transport);
