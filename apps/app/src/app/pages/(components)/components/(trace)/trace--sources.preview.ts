import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideGlobe } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-sources',
	imports: [HlmTraceImports, NgIcon],
	providers: [provideIcons({ lucideGlobe, lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-sm">
			<hlm-trace-collapsible [expanded]="true">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line>
						<hlm-trace-icon>
							<ng-icon name="lucideGlobe" />
						</hlm-trace-icon>
						<hlm-trace-title>Used {{ _sources.length }} sources</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-trace>
						@for (item of _sources; track $index) {
							<a hlmTraceLine [href]="item.href" target="_blank" rel="noreferrer">
								<hlm-trace-icon>
									<ng-icon name="lucideGlobe" />
								</hlm-trace-icon>
								<hlm-trace-title>
									{{ item.title }}
									<span class="sr-only">(opens in a new tab)</span>
								</hlm-trace-title>
								<hlm-trace-icon>
									<ng-icon name="lucideArrowUpRight" />
								</hlm-trace-icon>
							</a>
						}
					</hlm-trace>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</div>
	`,
})
export class TraceSources {
	protected readonly _sources = [
		{
			title: 'Angular components | angular.dev',
			href: 'https://angular.dev/guide/components',
		},
		{
			title: 'Angular signals | angular.dev',
			href: 'https://angular.dev/guide/signals',
		},
		{
			title: 'Settings: minimumReleaseAge | pnpm.io',
			href: 'https://pnpm.io/settings#minimumreleaseage',
		},
	];
}
