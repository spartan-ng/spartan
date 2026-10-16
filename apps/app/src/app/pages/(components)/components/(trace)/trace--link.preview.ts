import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideFileText, lucideGlobe } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-link',
	imports: [HlmTraceImports, NgIcon, RouterLink],
	providers: [provideIcons({ lucideFileText, lucideChevronRight, lucideGlobe, lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<a hlmTraceLine routerLink=".">
				<hlm-trace-icon>
					<ng-icon name="lucideFileText" />
				</hlm-trace-icon>
				<hlm-trace-title>Read apps/v4/lib/docs.ts</hlm-trace-title>
				<hlm-trace-icon>
					<ng-icon name="lucideChevronRight" />
				</hlm-trace-icon>
			</a>
			<a hlmTraceLine href="https://spartan.ng/documentation/installation" target="_blank" rel="noreferrer">
				<hlm-trace-icon>
					<ng-icon name="lucideGlobe" />
				</hlm-trace-icon>
				<hlm-trace-title>
					Install spartan/ui | spartan.ng
					<span class="sr-only">(opens in a new tab)</span>
				</hlm-trace-title>
				<hlm-trace-icon>
					<ng-icon name="lucideArrowUpRight" />
				</hlm-trace-icon>
			</a>
		</hlm-trace>
	`,
})
export class TraceLink {}
