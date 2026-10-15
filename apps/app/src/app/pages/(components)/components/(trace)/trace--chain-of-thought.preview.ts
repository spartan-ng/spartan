import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFileText, lucideSearch } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-chain-of-thought',
	imports: [HlmTraceImports, NgIcon, HlmBadge, RouterLink],
	providers: [provideIcons({ lucideSearch, lucideFileText, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-sm">
			<hlm-trace-collapsible [expanded]="true">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line status="running">
						<hlm-trace-title>Looking into the slow deploy</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-trace>
						<hlm-trace-collapsible>
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line>
									<hlm-trace-icon>
										<ng-icon name="lucideSearch" />
									</hlm-trace-icon>
									<hlm-trace-title>Searched for the checkout build log</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content class="flex flex-wrap gap-1.5">
								<span hlmBadge variant="secondary">analogjs.org</span>
								<span hlmBadge variant="secondary">github.com</span>
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>
						<a routerLink="." fragment="chain-of-thought" hlmTraceLine>
							<hlm-trace-icon>
								<ng-icon name="lucideFileText" />
							</hlm-trace-icon>
							<hlm-trace-title>Read the last twelve deploys</hlm-trace-title>
							<hlm-trace-icon>
								<ng-icon name="lucideChevronRight" />
							</hlm-trace-icon>
						</a>
						<hlm-trace-collapsible>
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line status="running">
									<hlm-trace-icon>
										<ng-icon name="lucideSearch" />
									</hlm-trace-icon>
									<hlm-trace-title>Searching for the cache key</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								<!-- TODO code block here -->
								<div>cache key image optimization</div>
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>
					</hlm-trace>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</div>
	`,
})
export class TraceChainOfThought {}
