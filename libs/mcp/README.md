# @spartan-ng/mcp

[![npm version](https://img.shields.io/npm/v/@spartan-ng/mcp.svg?style=flat-square)](https://www.npmjs.com/package/@spartan-ng/mcp)
[![npm downloads](https://img.shields.io/npm/dm/@spartan-ng/mcp.svg?style=flat-square)](https://www.npmjs.com/package/@spartan-ng/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Discord](https://dcbadge.limes.pink/api/server/EqHnxQ4uQr?style=flat-square)](https://discord.gg/EqHnxQ4uQr)

[Website](https://www.spartan.ng) • [Documentation](https://www.spartan.ng/documentation/mcp) • [Components](https://www.spartan.ng/components) • [GitHub](https://github.com/spartan-ng/spartan)

> The official [Model Context Protocol](https://modelcontextprotocol.io) server for [spartan/ui](https://www.spartan.ng). Give your AI assistant up-to-date Spartan documentation, components, and blocks.

`@spartan-ng/mcp` exposes the [Spartan](https://www.spartan.ng) Angular UI ecosystem - documentation, components, and blocks - as tools, resources, and prompts for MCP clients such as Claude Desktop, Cursor, and other AI assistants. It fetches content live from the public Spartan site and caches it on disk per version, so assistants can answer questions about Spartan components with current API tables and code examples.

## What it provides

- **Components** - list components and fetch a component's documentation, with structured Brain API (`Brn*`) / Helm API (`Hlm*`) extraction or raw code blocks.
- **Blocks** - list and fetch pre-built UI patterns (sidebar, login, signup, calendar) and analyze the components/packages they depend on.
- **Docs** - fetch official documentation topics (installation, cli, theming, dark-mode, typography, health-checks, update-guide) with optional code/heading/link extraction.
- **Analysis** - inspect a component's dependencies (npm packages, Angular CDK, peer components, imports) and its accessibility features (ARIA, keyboard, screen reader, WCAG).
- **Health** - check availability of the Spartan docs site and surface the Spartan CLI health-check commands.
- **Caching** - version-aware on-disk cache with status, clear, rebuild, switch-version, and list-versions tools.

## Installation

### With `npx` (no install)

Configure your MCP client:

```json
{
	"mcpServers": {
		"spartan-ui": {
			"command": "npx",
			"args": ["-y", "@spartan-ng/mcp"]
		}
	}
}
```

### Global install

```bash
npm install -g @spartan-ng/mcp
```

```json
{
	"mcpServers": {
		"spartan-ui": {
			"command": "spartan-mcp"
		}
	}
}
```

### Local build

```json
{
	"mcpServers": {
		"spartan-ui": {
			"command": "node",
			"args": ["/path/to/dist/libs/mcp/src/server.js"]
		}
	}
}
```

1. Run `nx build mcp` to compile to `dist/libs/mcp`.
2. Point `args` at the built `src/server.js`.
3. Restart your MCP client.

## MCP surface

### Tools (17)

| Tool                              | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `spartan_components_list`         | List known components with documentation URLs                            |
| `spartan_components_get`          | Fetch a component page; `extract: 'code' \| 'api'`                       |
| `spartan_components_dependencies` | Analyze a component's dependencies                                       |
| `spartan_accessibility_check`     | Analyze a component's accessibility features                             |
| `spartan_blocks_list`             | List known blocks                                                        |
| `spartan_blocks_get`              | Fetch a block page; `format: 'html' \| 'text'`                           |
| `spartan_blocks_dependencies`     | Analyze a block's dependencies                                           |
| `spartan_docs_get`                | Fetch a docs topic; `extract: 'none' \| 'code' \| 'headings' \| 'links'` |
| `spartan_meta`                    | Topics, components, and blocks for client autocomplete                   |
| `spartan_health_check`            | Check availability of docs/component pages                               |
| `spartan_health_instructions`     | Spartan CLI health-check instructions                                    |
| `spartan_health_command`          | Build the exact health-check command (`ng`/`nx`)                         |
| `spartan_cache_status`            | Current cache version and statistics                                     |
| `spartan_cache_clear`             | Clear the current (or all) cache version(s)                              |
| `spartan_cache_rebuild`           | Rebuild the cache from the live site                                     |
| `spartan_cache_switch_version`    | Switch the active cache version                                          |
| `spartan_cache_list_versions`     | List cached versions                                                     |

### Resources (4)

- `spartan://components/list`
- `spartan://component/{name}/api`
- `spartan://component/{name}/examples`
- `spartan://component/{name}/full`

### Prompts (5)

- `spartan-get-started`
- `spartan-compare-apis`
- `spartan-implement-feature`
- `spartan-troubleshoot`
- `spartan-list-components`

## Example tool calls

```json
// List all known components
{ "tool": "spartan_components_list" }

// Fetch the accordion's structured API data
{ "tool": "spartan_components_get", "name": "accordion", "extract": "api" }

// Fetch a docs topic and extract its headings
{ "tool": "spartan_docs_get", "topic": "cli", "extract": "headings" }

// Fetch a block as plain text
{ "tool": "spartan_blocks_get", "name": "sidebar", "format": "text" }

// Analyze a component's dependencies
{ "tool": "spartan_components_dependencies", "componentName": "dialog" }

// Check docs-site availability
{ "tool": "spartan_health_check", "topics": ["installation", "cli"] }
```

## Configuration

Environment variables:

| Variable                  | Default                                                 | Description                                                                 |
| ------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `SPARTAN_MCP_CACHE_DIR`   | `$XDG_CACHE_HOME/spartan-mcp` or `~/.cache/spartan-mcp` | Directory for the on-disk version cache. Override to use a custom location. |
| `SPARTAN_CACHE_TTL_MS`    | `300000` (5 min)                                        | TTL for the in-memory fetch cache.                                          |
| `SPARTAN_CACHE_TTL_HOURS` | `24`                                                    | TTL for on-disk cached entries before they are considered stale.            |

## Notes

- **Data source**: all content is fetched from public pages at [spartan.ng](https://www.spartan.ng); responses include source URLs.
- **Input validation**: all tool inputs are validated with Zod schemas.
- **Versions**: cached data is stored per Spartan UI version under `cache/{version}/`; pass `spartanVersion` to component/block/docs tools or use `spartan_cache_switch_version`.

## Development

This library was generated with [Nx](https://nx.dev).

- Build: `nx build mcp`
- Test: `nx test mcp`
- Lint: `nx lint mcp`

## Documentation

- [MCP server guide](https://www.spartan.ng/documentation/mcp)
- [Installation guide](https://www.spartan.ng/documentation/installation)
- [CLI documentation](https://www.spartan.ng/documentation/cli)
- [Components](https://www.spartan.ng/components)

## Community

- [Discord](https://discord.gg/EqHnxQ4uQr)
- [GitHub](https://github.com/spartan-ng/spartan)
- [Twitter / X](https://twitter.com/goetzrobin)
- [Sponsor the project](https://github.com/sponsors/goetzrobin)

## License

MIT © [goetzrobin](https://github.com/goetzrobin) and the [spartan contributors](https://github.com/spartan-ng/spartan/graphs/contributors)
