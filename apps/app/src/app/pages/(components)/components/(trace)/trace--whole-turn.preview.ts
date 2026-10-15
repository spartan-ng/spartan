import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideChevronRight, lucideCircleAlert, lucideFileText, lucideTerminal } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-whole-turn',
	imports: [HlmTraceImports, NgIcon, RouterLink],
	providers: [provideIcons({ lucideBrain, lucideTerminal, lucideCircleAlert, lucideFileText, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-collapsible [expanded]="true">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line status="error">
						<hlm-trace-title>Worked for 2m 4s, 1 command failed</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-trace>
						<hlm-trace-collapsible>
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line>
									<hlm-trace-icon>
										<ng-icon name="lucideBrain" />
									</hlm-trace-icon>
									<hlm-trace-title>Thought</hlm-trace-title>
									<hlm-trace-description>12s</hlm-trace-description>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								I'll check the installed Node and pnpm versions before touching the lockfile.
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>

						<hlm-trace-collapsible [expanded]="true">
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line status="error">
									<hlm-trace-icon>
										<ng-icon name="lucideTerminal" />
									</hlm-trace-icon>
									<hlm-trace-title>Ran 2 commands, 1 failed</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								<hlm-trace>
									<hlm-trace-line>
										<hlm-trace-icon>
											<ng-icon name="lucideTerminal" />
										</hlm-trace-icon>
										<hlm-trace-title>Ran node --version</hlm-trace-title>
									</hlm-trace-line>
									<hlm-trace-collapsible>
										<button hlmTraceCollapsibleTrigger>
											<hlm-trace-line status="error">
												<hlm-trace-icon>
													<ng-icon name="lucideCircleAlert" />
												</hlm-trace-icon>
												<hlm-trace-title>Failed to run pnpm --version</hlm-trace-title>
											</hlm-trace-line>
										</button>
										<hlm-trace-collapsible-content>
											<!-- TODO code block here -->
											command not found: pnpm
										</hlm-trace-collapsible-content>
									</hlm-trace-collapsible>
								</hlm-trace>
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>

						<p class="text-muted-foreground text-sm">Node is installed and pnpm is not. Reading the docs config.</p>

						<a hlmTraceLine routerLink="." fragment="whole-turn">
							<hlm-trace-icon>
								<ng-icon name="lucideFileText" />
							</hlm-trace-icon>
							<hlm-trace-title>Read apps/v4/lib/docs.ts</hlm-trace-title>
							<hlm-trace-icon>
								<ng-icon name="lucideChevronRight" />
							</hlm-trace-icon>
						</a>
					</hlm-trace>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</hlm-trace>
	`,
})
export class TraceWholeTurn {}
