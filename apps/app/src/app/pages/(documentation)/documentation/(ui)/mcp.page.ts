import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'MCP Server' },
	meta: metaWith(
		'spartan - MCP Server',
		'Expose spartan UI documentation, components, and blocks to AI assistants over the Model Context Protocol.',
	),
	title: 'spartan - MCP Server',
};

@Component({
	selector: 'spartan-mcp',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink, PageNav, SectionSubHeading, Code],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="MCP Server"
				lead="Give your AI assistant first-class access to spartan UI documentation, components, and blocks."
			/>

			<p class="${hlmP}">
				<code class="${hlmCode}">&#64;spartan-ng/mcp</code>
				is a
				<a href="https://modelcontextprotocol.io" class="${hlmCode} underline" target="_blank" rel="noreferrer">
					Model Context Protocol
				</a>
				server that exposes the spartan ecosystem as tools, resources, and prompts. MCP clients such as Claude Desktop,
				Cursor, and other AI assistants can use it to answer questions about spartan components with up-to-date API
				tables and code examples, fetched live from
				<a href="https://www.spartan.ng" class="${hlmCode} underline">spartan.ng</a>
				and cached on disk per version.
			</p>

			<spartan-section-sub-heading id="setup">Setup</spartan-section-sub-heading>
			<p class="${hlmP}">
				Add the server to your MCP client configuration. No installation is required - it runs on demand via
				<code class="${hlmCode}">npx</code>
				:
			</p>
			<spartan-code
				class="mt-4"
				language="js"
				code='
{
	"mcpServers": {
		"spartan-ui": {
			"command": "npx",
			"args": ["-y", "@spartan-ng/mcp"]
		}
	}
}'
			/>

			<p class="${hlmP}">Prefer a global install? Install the package and point the command at the binary:</p>
			<spartan-code class="mt-4" language="sh" code="npm install -g @spartan-ng/mcp" />
			<spartan-code
				class="mt-4"
				language="js"
				code='
{
	"mcpServers": {
		"spartan-ui": {
			"command": "spartan-mcp"
		}
	}
}'
			/>

			<spartan-section-sub-heading id="tools">Tools</spartan-section-sub-heading>
			<p class="${hlmP}">The server registers 17 tools, grouped by purpose:</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					<strong>Components:</strong>
					<code class="${hlmCode}">spartan_components_list</code>
					,
					<code class="${hlmCode}">spartan_components_get</code>
					(with
					<code class="${hlmCode}">extract: 'code' | 'api'</code>
					),
					<code class="${hlmCode}">spartan_components_dependencies</code>
					, and
					<code class="${hlmCode}">spartan_accessibility_check</code>
					.
				</li>
				<li>
					<strong>Blocks:</strong>
					<code class="${hlmCode}">spartan_blocks_list</code>
					,
					<code class="${hlmCode}">spartan_blocks_get</code>
					, and
					<code class="${hlmCode}">spartan_blocks_dependencies</code>
					.
				</li>
				<li>
					<strong>Docs:</strong>
					<code class="${hlmCode}">spartan_docs_get</code>
					and
					<code class="${hlmCode}">spartan_meta</code>
					.
				</li>
				<li>
					<strong>Health:</strong>
					<code class="${hlmCode}">spartan_health_check</code>
					,
					<code class="${hlmCode}">spartan_health_instructions</code>
					, and
					<code class="${hlmCode}">spartan_health_command</code>
					.
				</li>
				<li>
					<strong>Cache:</strong>
					<code class="${hlmCode}">spartan_cache_status</code>
					,
					<code class="${hlmCode}">spartan_cache_clear</code>
					,
					<code class="${hlmCode}">spartan_cache_rebuild</code>
					,
					<code class="${hlmCode}">spartan_cache_switch_version</code>
					, and
					<code class="${hlmCode}">spartan_cache_list_versions</code>
					.
				</li>
			</ul>

			<spartan-section-sub-heading id="resources-and-prompts">Resources and prompts</spartan-section-sub-heading>
			<p class="${hlmP}">
				Beyond tools, the server exposes resources for direct component lookups and prompts for common workflows.
			</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					<strong>Resources:</strong>
					<code class="${hlmCode}">spartan://components/list</code>
					and per-component
					<code class="${hlmCode}">spartan://component/&lbrace;name&rbrace;/api</code>
					,
					<code class="${hlmCode}">/examples</code>
					, and
					<code class="${hlmCode}">/full</code>
					.
				</li>
				<li>
					<strong>Prompts:</strong>
					<code class="${hlmCode}">spartan-get-started</code>
					,
					<code class="${hlmCode}">spartan-compare-apis</code>
					,
					<code class="${hlmCode}">spartan-implement-feature</code>
					,
					<code class="${hlmCode}">spartan-troubleshoot</code>
					, and
					<code class="${hlmCode}">spartan-list-components</code>
					.
				</li>
			</ul>

			<spartan-section-sub-heading id="configuration">Configuration</spartan-section-sub-heading>
			<p class="${hlmP}">Behaviour can be tuned with environment variables:</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					<code class="${hlmCode}">SPARTAN_MCP_CACHE_DIR</code>
					- directory for the on-disk version cache. Defaults to
					<code class="${hlmCode}">$XDG_CACHE_HOME/spartan-mcp</code>
					, falling back to
					<code class="${hlmCode}">~/.cache/spartan-mcp</code>
					.
				</li>
				<li>
					<code class="${hlmCode}">SPARTAN_CACHE_TTL_MS</code>
					- TTL for the in-memory fetch cache (default 5 minutes).
				</li>
				<li>
					<code class="${hlmCode}">SPARTAN_CACHE_TTL_HOURS</code>
					- TTL before on-disk cached entries are considered stale (default 24 hours).
				</li>
			</ul>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="skills" label="Skills" />
				<spartan-page-bottom-nav-link direction="previous" href="update-guide" label="Update Guide" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class McpPage {}
