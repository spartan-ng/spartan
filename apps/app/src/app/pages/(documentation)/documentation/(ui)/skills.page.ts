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
	data: { breadcrumb: 'Skills' },
	meta: metaWith(
		'spartan - Skills',
		'Give coding agents the context to build spartan UI correctly with the spartan agent skill.',
	),
	title: 'spartan - Skills',
};

@Component({
	selector: 'spartan-skills',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink, PageNav, SectionSubHeading, Code],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Skills"
				lead="Give your coding agent the procedural knowledge to build spartan UI correctly."
			/>

			<p class="${hlmP}">
				The
				<code class="${hlmCode}">spartan</code>
				skill is an
				<a href="https://skills.sh" class="${hlmCode} underline" target="_blank" rel="noreferrer">agent skill</a>
				that teaches AI coding assistants (Claude Code, Cursor, Copilot, and others) how spartan/ui works: the
				Brain/Helm two-layer architecture, the CLI generators, component composition rules, theming, and how to discover
				components before writing code. It activates automatically on any project with a
				<code class="${hlmCode}">components.json</code>
				file.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">Install the skill into your project with a single command:</p>
			<spartan-code class="mt-4" language="sh" code="npx skills add spartan-ng/spartan" />
			<p class="${hlmP}">
				This copies the skill into your agent's skills directory (for Claude Code,
				<code class="${hlmCode}">.claude/skills/spartan</code>
				). Add the
				<code class="${hlmCode}">-g</code>
				flag to install it globally instead.
			</p>

			<spartan-section-sub-heading id="what-it-does">What it does</spartan-section-sub-heading>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					<strong>Project context:</strong>
					runs
					<code class="${hlmCode}">@spartan-ng/cli:info --json</code>
					to read your config, versions, and installed components before generating code.
				</li>
				<li>
					<strong>Component discovery:</strong>
					uses the
					<a href="/documentation/mcp" class="${hlmCode} underline">MCP server</a>
					and the docs to confirm APIs and examples instead of guessing.
				</li>
				<li>
					<strong>Composition rules:</strong>
					enforces the Brain/Helm patterns - semantic colors, field-based forms, correct overlay/group nesting, and
					<code class="${hlmCode}">&#64;ng-icons</code>
					usage.
				</li>
				<li>
					<strong>CLI usage:</strong>
					knows when to run
					<code class="${hlmCode}">init</code>
					,
					<code class="${hlmCode}">ui</code>
					,
					<code class="${hlmCode}">ui-theme</code>
					, and
					<code class="${hlmCode}">healthcheck</code>
					, with the right Nx or Angular CLI invocation.
				</li>
			</ul>

			<spartan-section-sub-heading id="project-context">Project context command</spartan-section-sub-heading>
			<p class="${hlmP}">
				The skill relies on a read-only
				<code class="${hlmCode}">info</code>
				generator that prints your project context as JSON. You can run it yourself:
			</p>
			<spartan-code class="mt-4" language="sh" code="npx nx g @spartan-ng/cli:info --json" />
			<p class="${hlmP}">
				It reports the workspace type, the
				<code class="${hlmCode}">components.json</code>
				config (components path, import alias, generate strategy), package versions, the detected icon library and
				styles file, and the lists of installed and available components.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/components" label="Components" />
				<spartan-page-bottom-nav-link direction="previous" href="mcp" label="MCP Server" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class SkillsPage {}
