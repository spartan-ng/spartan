import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';
import { hlmP } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Figma' },
	meta: metaWith('spartan - Figma', 'Design with the same components you build. Figma UI kit for spartan components.'),
	title: 'spartan - Figma',
};

@Component({
	selector: 'spartan-figma',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		HlmAspectRatioImports,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Figma" lead="Design with shadcn components. Build with spartan." />

			<p class="${hlmP}">
				Because spartan adapts shadcn/ui patterns for Angular, you can use shadcn design resources for prototyping. This
				includes Figma UI kits created by the community.
			</p>

			<p class="${hlmP}">
				<a class="font-medium hover:underline" href="https://twitter.com/skirano" target="_blank">Pietro Schirano</a>
				created a Figma UI kit for shadcn components. Explore the kit below:
			</p>

			<div class="mt-6" hlmAspectRatio="16/9">
				<iframe
					src="https://embed.figma.com/file/1203061493325953101/hf_embed?community_viewer=true&amp;embed_host=shadcn&amp;hub_file_id=1203061493325953101&amp;kind=&amp;viewer=1"
					class="bg-muted h-full w-full overflow-hidden rounded-lg border"
				></iframe>
			</div>

			<spartan-section-sub-heading id="get-started">Get the Figma Kit</spartan-section-sub-heading>

			<p class="${hlmP}">Duplicate the file to your Figma account:</p>

			<a
				class="mt-2 block text-lg font-medium underline"
				target="_blank"
				href="https://www.figma.com/community/file/1203061493325953101"
			>
				Get Figma UI Kit →
			</a>

			<p class="${hlmP} mt-6">
				Since spartan components follow shadcn patterns, designs created with shadcn-based Figma kits can be implemented
				with matching spartan components in your Angular app.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link direction="next" href="version-support" label="Version Support" />
				<spartan-page-bottom-nav-link direction="previous" href="typography" label="Typography" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class FigmaPage {}
