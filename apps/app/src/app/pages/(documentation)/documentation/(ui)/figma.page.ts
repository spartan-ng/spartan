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
			<spartan-section-intro
				name="Figma"
				lead="Design with the same components you build. Figma UI kit for spartan components."
			/>

			<p class="${hlmP}">
				A dedicated Figma UI kit lets you design with the exact same components you build with spartan, keeping your
				mockups and your Angular implementation in sync.
			</p>

			<p class="${hlmP}">
				<a class="font-medium hover:underline" href="https://www.figma.com/@mislavpongrac" target="_blank">
					Mislav Pongrac
				</a>
				created a 1:1 Figma design kit of spartan/ui. Explore the kit below:
			</p>

			<div class="mt-6" hlmAspectRatio="16/9">
				<iframe
					src="https://embed.figma.com/file/1691576794328156128/hf_embed?community_viewer=true&amp;embed_host=spartan&amp;hub_file_id=1691576794328156128&amp;kind=&amp;viewer=1"
					class="bg-muted h-full w-full overflow-hidden rounded-lg border"
				></iframe>
			</div>

			<spartan-section-sub-heading id="get-started">Get the Figma Kit</spartan-section-sub-heading>

			<p class="${hlmP}">Duplicate the file to your Figma account:</p>

			<a
				class="mt-2 block text-lg font-medium underline"
				target="_blank"
				href="https://www.figma.com/community/file/1691576794328156128/spartan-ui-for-figma-a-1-1-design-kit-of-spartan-ng"
			>
				Get Figma UI Kit →
			</a>

			<p class="${hlmP} mt-6">
				Because the kit mirrors the Brain and Helm components 1:1, designs created with it can be implemented directly
				with matching spartan components in your Angular app.
			</p>

			<p class="${hlmP} mt-6">
				A big thanks to
				<a class="font-medium hover:underline" href="https://www.figma.com/@mislavpongrac" target="_blank">
					Mislav Pongrac
				</a>
				for creating this Figma kit for the community!
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
