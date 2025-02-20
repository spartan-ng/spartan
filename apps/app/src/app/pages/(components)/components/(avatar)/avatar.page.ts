import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { TabsCliComponent } from '@spartan-ng/app/app/shared/layout/tabs-cli.component';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '../../../../shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AvatarPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './avatar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Avatar' },
	meta: metaWith('spartan/ui - Avatar', 'An image element with a fallback for representing the user.'),
	title: 'spartan/ui - Avatar',
};

@Component({
	selector: 'spartan-avatar',
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavPlaceholderComponent,
		AvatarPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Avatar" lead="An image element with a fallback for representing the user." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui avatar"
				ngCode="ng g @spartan-ng/cli:ui avatar"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="badge" label="Badge" />
				<spartan-page-bottom-nav-link direction="previous" href="aspect-ratio" label="Aspect Ratio" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AvatarPageComponent {
	public readonly defaultCode = defaultCode;
	public readonly defaultSkeleton = defaultSkeleton;
	public readonly defaultImports = defaultImports;
}
