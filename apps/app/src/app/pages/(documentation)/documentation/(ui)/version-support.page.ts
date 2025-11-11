import type { RouteMeta } from '@analogjs/router';
import { Component, VERSION } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideExternalLink } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { metaWith } from '../../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Version Support' },
	meta: metaWith('spartan - Version Support', 'Learn about Angular version support policy for spartan/ui components'),
	title: 'spartan - Version Support',
};

@Component({
	selector: 'spartan-version-support',
	imports: [
		MainSection,
		SectionIntro,
		SectionSubHeading,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		HlmButtonImports,
		NgIcon,
		HlmIconImports,
		HlmBadgeImports,
	],
	providers: [provideIcons({ lucideChevronRight, lucideExternalLink })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Angular Version Support"
				lead="Our commitment to keeping spartan/ui compatible with the latest Angular versions while providing stability for your projects"
			/>

			<spartan-section-sub-heading id="support-policy">Support Policy</spartan-section-sub-heading>
			<p class="${hlmP}">
				spartan/ui supports the
				<strong>two latest major Angular versions</strong>
				. This approach provides approximately one year of support for users while keeping the library up-to-date with
				the latest Angular features and improvements.
			</p>

			<spartan-section-sub-heading id="current-support">Current Support Status</spartan-section-sub-heading>
			<div class="mt-4 flex flex-col gap-4 rounded-lg border p-6">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<span hlmBadge variant="default">Angular {{ version + 1 }}</span>
						<span class="text-muted-foreground text-sm">Actively supported</span>
					</div>
					<span class="text-muted-foreground text-sm">Until {{ getSupportEndDate(version + 1) }}</span>
				</div>
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<span hlmBadge variant="outline">Angular {{ version }}</span>
						<span class="text-muted-foreground text-sm">Actively supported</span>
					</div>
					<span class="text-muted-foreground text-sm">Until {{ getSupportEndDate(version) }}</span>
				</div>
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<span hlmBadge variant="secondary">Angular {{ version - 1 }}</span>
						<span class="text-muted-foreground text-sm">Not supported</span>
					</div>
					<span class="text-muted-foreground text-sm">Support ended</span>
				</div>
			</div>

			<spartan-section-sub-heading id="upgrade-timeline">Upgrade Timeline</spartan-section-sub-heading>
			<p class="${hlmP}">Our Angular version support follows a predictable timeline:</p>

			<div class="my-6 space-y-4">
				<div class="flex gap-4">
					<div
						class="text-primary bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-medium"
					>
						1
					</div>
					<div>
						<h4 class="font-medium">Pre-Release Evaluation</h4>
						<p class="text-muted-foreground text-sm">
							When the next major Angular version is soon to be released (v{{ version + 2 }}), we begin evaluating
							compatibility and planning updates.
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div
						class="text-primary bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-medium"
					>
						2
					</div>
					<div>
						<h4 class="font-medium">Support Update Released</h4>
						<p class="text-muted-foreground text-sm">
							When a new major Angular (v{{ version + 2 }}) is released, we update spartan/ui to support it and the
							previous major (v{{ version + 1 }}).
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div
						class="text-primary bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-medium"
					>
						3
					</div>
					<div>
						<h4 class="font-medium">Oldest Version Support Dropped</h4>
						<p class="text-muted-foreground text-sm">
							The oldest Angular version immediately moves out of our support window with the update. We recommend
							upgrading to maintain compatibility with future spartan/ui releases.
						</p>
					</div>
				</div>
			</div>

			<spartan-section-sub-heading id="questions">Questions?</spartan-section-sub-heading>
			<p class="${hlmP}">
				If you have questions about our version support policy or need guidance on upgrading your Angular project with
				spartan/ui, feel free to start a
				<a
					href="https://github.com/spartan-ng/spartan/discussions"
					target="_blank"
					class="${hlmCode} inline-flex items-center gap-1 underline"
				>
					discussion on GitHub
					<ng-icon name="lucideExternalLink" hlm size="sm" />
				</a>
				or join our
				<a
					href="https://discord.gg/EqHnxQ4uQr"
					target="_blank"
					class="${hlmCode} inline-flex items-center gap-1 underline"
				>
					Discord community
					<ng-icon name="lucideExternalLink" hlm size="sm" />
				</a>
				to connect with the team and other users.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link direction="next" href="health-checks" label="Health Checks" />
				<spartan-page-bottom-nav-link direction="previous" href="figma" label="Figma" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class VersionSupportPage {
	public readonly version = Number(VERSION.major);

	protected getSupportEndDate(angularVersion: number): string {
		// Support ends when Angular version + 2 is released (we support 2 latest versions)
		// So Angular 19 support ends when Angular 21 is released
		const targetVersion = angularVersion + 2;

		// Calculate when that version will be released
		// Angular versions follow the pattern: odd versions in November, even in May
		const versionsSince18 = targetVersion - 18;

		// Each version is 6 months apart, starting from Angular 18 in May 2024
		const monthsFromMay2024 = versionsSince18 * 6;
		const releaseDate = new Date(2024, 4, 1); // May 1, 2024
		releaseDate.setMonth(releaseDate.getMonth() + monthsFromMay2024);

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		return `${monthNames[releaseDate.getMonth()]} ${releaseDate.getFullYear()}`;
	}
}
