import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import {
	hlmBlockquote,
	hlmCode,
	hlmH1,
	hlmH2,
	hlmH3,
	hlmH4,
	hlmLarge,
	hlmLead,
	hlmMuted,
	hlmP,
	hlmSmall,
	hlmUl,
} from '@spartan-ng/helm/typography';
import { Code } from '../../../../../shared/code/code';
import { CodePreview } from '../../../../../shared/code/code-preview';
import { MainSection } from '../../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../../shared/layout/tabs';
import { TabsCli } from '../../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../../shared/meta/meta.util';
import TypographyPreview, {
	blockquoteCode,
	codeCode,
	h1Code,
	h2Code,
	h3Code,
	h4Code,
	largeCode,
	leadCode,
	listCode,
	mutedCode,
	pCode,
	smallCode,
	themingCode,
} from './typography.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Typography' },
	meta: metaWith('spartan - Typography', 'Styles for headings, paragraphs, lists... etc.'),
	title: 'spartan - Typography',
};

@Component({
	selector: 'spartan-dark-mode',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		Code,
		Tabs,
		TabsCli,
		TypographyPreview,
		CodePreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Typography" lead="Styles for headings, paragraphs, lists... etc." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-typography-preview />
				</div>
				<spartan-code secondTab [code]="_themingCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui typography" ngCode="ng g @spartan-ng/cli:ui typography" />

			<spartan-section-sub-heading id="h1">h1</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab><h1 class="${hlmH1}">Taxing Laughter: The Joke Tax Chronicles</h1></div>
				<spartan-code secondTab [code]="_h1Code" />
			</spartan-tabs>
			<spartan-section-sub-heading id="h2">h2</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab><h2 class="${hlmH2}">The People of the Kingdom</h2></div>
				<spartan-code secondTab [code]="_h2Code" />
			</spartan-tabs>
			<spartan-section-sub-heading id="h3">h3</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab><h3 class="${hlmH3}">The Joke Tax</h3></div>
				<spartan-code secondTab [code]="_h3Code" />
			</spartan-tabs>
			<spartan-section-sub-heading id="h4">h4</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab><h4 class="${hlmH4}">People stopped telling jokes</h4></div>
				<spartan-code secondTab [code]="_h4Code" />
			</spartan-tabs>
			<spartan-section-sub-heading id="p">p</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<p class="${hlmP}">
						The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke
						tax.
					</p>
				</div>
				<spartan-code secondTab [code]="_pCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="blockquote">Blockquote</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<blockquote class="${hlmBlockquote}">
						"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the
						privilege."
					</blockquote>
				</div>
				<spartan-code secondTab [code]="_blockquoteCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="list">list</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<ul class="${hlmUl}">
						<li>1st level of puns: 5 gold coins</li>
						<li>2nd level of jokes: 10 gold coins</li>
						<li>3rd level of one-liners : 20 gold coins</li>
					</ul>
				</div>
				<spartan-code secondTab [code]="_listCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="inline-code">Inline Code</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<code class="${hlmCode}">&#64;radix-ui/react-alert-dialog</code>
				</div>
				<spartan-code secondTab [code]="_codeCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="lead">Lead</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<p class="${hlmLead}">
						A modal dialog that interrupts the user with important content and expects a response.
					</p>
				</div>
				<spartan-code secondTab [code]="_leadCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="large">Large</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<p class="${hlmLarge}">Are you sure absolutely sure?</p>
				</div>
				<spartan-code secondTab [code]="_largeCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="small">Small</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<p class="${hlmSmall}">Email address</p>
				</div>
				<spartan-code secondTab [code]="_smallCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="muted">Muted</spartan-section-sub-heading>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<p class="${hlmMuted}">Enter your email address.</p>
				</div>
				<spartan-code secondTab [code]="_mutedCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="figma" label="Figma" />
				<spartan-page-bottom-nav-link direction="previous" href="dark-mode" label="Dark Mode" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class TypographyPage {
	protected readonly _themingCode = themingCode;
	protected readonly _h1Code = h1Code;
	protected readonly _h2Code = h2Code;
	protected readonly _h3Code = h3Code;
	protected readonly _h4Code = h4Code;
	protected readonly _pCode = pCode;
	protected readonly _blockquoteCode = blockquoteCode;
	protected readonly _listCode = listCode;
	protected readonly _codeCode = codeCode;
	protected readonly _mutedCode = mutedCode;
	protected readonly _smallCode = smallCode;
	protected readonly _largeCode = largeCode;
	protected readonly _leadCode = leadCode;
}
