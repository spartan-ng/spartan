# Using the spartan MCP server

`@spartan-ng/mcp` is a Model Context Protocol server that exposes spartan's component docs, APIs,
examples, blocks, and accessibility info (sourced from `https://www.spartan.ng` with a local cache).
When it is connected, use it for discovery instead of guessing selectors or fetching pages by hand.

## Configuration

No install (recommended):

```json
{
	"mcpServers": {
		"spartan-ui": { "command": "npx", "args": ["-y", "@spartan-ng/mcp"] }
	}
}
```

Global install:

```bash
npm install -g @spartan-ng/mcp
```

```json
{
	"mcpServers": { "spartan-ui": { "command": "spartan-mcp" } }
}
```

## Tools

Components and analysis:

- `spartan_components_list` - all components with their docs URLs.
- `spartan_components_get` - fetch a component page; `extract: "code" | "api"`.
- `spartan_components_dependencies` - npm/CDK/peer-component dependencies for a component.
- `spartan_accessibility_check` - ARIA/keyboard/WCAG notes for a component.

Blocks (prebuilt multi-component layouts - `sidebar`, `login`, `signup`, `calendar`):

- `spartan_blocks_list`, `spartan_blocks_get` (`format: "html" | "text"`), `spartan_blocks_dependencies`.

Docs and meta:

- `spartan_docs_get` - a docs topic (installation, cli, theming, dark-mode, ...);
  `extract: "none" | "code" | "headings" | "links"`.
- `spartan_meta` - topics/components/blocks index for autocomplete.

Health and cache:

- `spartan_health_check`, `spartan_health_instructions`, `spartan_health_command`.
- `spartan_cache_status`, `spartan_cache_clear`, `spartan_cache_rebuild`,
  `spartan_cache_switch_version`, `spartan_cache_list_versions`.

## Resources

- `spartan://components/list`
- `spartan://component/{name}/api`
- `spartan://component/{name}/examples`
- `spartan://component/{name}/full`

## Prompts

`spartan-get-started`, `spartan-compare-apis`, `spartan-implement-feature`, `spartan-troubleshoot`,
`spartan-list-components`.

## Recommended flow

1. `spartan_components_get` with `extract: "api"` to confirm selectors and inputs.
2. `spartan_components_get` with `extract: "code"` for a working example.
3. `spartan_components_dependencies` if you need to know what else gets installed.
4. Then add via the CLI (`@spartan-ng/cli:ui --name=<component>`).

If the MCP server is not connected, fall back to `https://www.spartan.ng/components/<name>` and the
`@spartan-ng/cli:info --json` output.
