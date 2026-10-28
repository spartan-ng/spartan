import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideGlobe } from '@ng-icons/lucide';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-dialog',
	imports: [HlmTraceImports, HlmDialogImports, NgIcon],
	providers: [provideIcons({ lucideGlobe, lucideChevronRight, lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-dialog>
				<button hlmDialogTrigger hlmTraceLine>
					<hlm-trace-icon>
						<ng-icon name="lucideGlobe" />
					</hlm-trace-icon>
					<hlm-trace-title>Searched the web for cache keys</hlm-trace-title>
					<hlm-trace-icon>
						<ng-icon name="lucideChevronRight" />
					</hlm-trace-icon>
				</button>

				<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:w-7xl">
					<hlm-dialog-header>
						<h3 hlmDialogTitle>Searched the web for cache keys</h3>
						<p hlmDialogDescription>Three results were used in the response.</p>
					</hlm-dialog-header>
					<hlm-trace>
						@for (item of _results; track $index) {
							<a hlmTraceLine [href]="item.url" target="_blank" rel="noreferrer">
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
				</hlm-dialog-content>
			</hlm-dialog>
		</hlm-trace>
	`,
})
export class TraceDialog {
	protected readonly _results = [
		{
			title: 'Angular components',
			url: 'https://angular.dev/guide/components',
		},
		{
			title: 'Angular signals',
			url: 'https://angular.dev/guide/signals',
		},
		{
			title: 'Analog content',
			url: 'https://analogjs.org/docs/features/routing/content',
		},
	];
}
