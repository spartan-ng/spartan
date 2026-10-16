import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideCircleAlert, lucideCircleCheck, lucideGlobe } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-preview',
	imports: [HlmTraceImports, HlmCodeBlockImports, NgIcon, HlmMessageImports, HlmBubbleImports],
	providers: [provideIcons({ lucideCircleCheck, lucideCircleAlert, lucideGlobe, lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
			<hlm-message align="end">
				<hlm-message-content>
					<hlm-bubble align="end" variant="muted">
						<hlm-bubble-content>Why does pnpm install fail in CI?</hlm-bubble-content>
					</hlm-bubble>
				</hlm-message-content>
			</hlm-message>

			<hlm-message>
				<hlm-message-content>
					<hlm-trace class="max-w-sm">
						<hlm-trace-collapsible>
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line>
									<hlm-trace-icon>
										<ng-icon name="lucideCircleCheck" />
									</hlm-trace-icon>
									<hlm-trace-title>Thought for 5s</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								The frozen install fails because package.json was bumped without the lockfile. I'll check the last
								commit.
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>

						<hlm-trace-line>
							<hlm-trace-icon>
								<ng-icon name="lucideCircleCheck" />
							</hlm-trace-icon>
							<hlm-trace-title>Ran pnpm --version</hlm-trace-title>
						</hlm-trace-line>

						<hlm-trace-collapsible [expanded]="true">
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line>
									<hlm-trace-icon>
										<ng-icon name="lucideCircleCheck" />
									</hlm-trace-icon>
									<hlm-trace-title>Ran git diff --stat HEAD~1 -- package.json pnpm-lock.yaml</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								<hlm-code-block size="sm">
									<pre hlmCodeBlockContent [code]="_diff"></pre>
								</hlm-code-block>
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>

						<hlm-trace-line status="error">
							<hlm-trace-icon>
								<ng-icon name="lucideCircleAlert" />
							</hlm-trace-icon>
							<hlm-trace-title>Failed to run pnpm install --frozen-lockfile</hlm-trace-title>
						</hlm-trace-line>

						<hlm-trace-collapsible>
							<button hlmTraceCollapsibleTrigger>
								<hlm-trace-line>
									<hlm-trace-icon>
										<ng-icon name="lucideGlobe" />
									</hlm-trace-icon>
									<hlm-trace-title>Used 2 sources</hlm-trace-title>
								</hlm-trace-line>
							</button>
							<hlm-trace-collapsible-content>
								<hlm-trace>
									<a hlmTraceLine href="https://pnpm.io/settings#minimumreleaseage" target="_blank" rel="noreferrer">
										<hlm-trace-icon>
											<ng-icon name="lucideGlobe" />
										</hlm-trace-icon>
										<hlm-trace-title>
											Settings: minimumReleaseAge | pnpm.io
											<span class="sr-only">(opens in a new tab)</span>
										</hlm-trace-title>
										<hlm-trace-icon>
											<ng-icon name="lucideArrowUpRight" />
										</hlm-trace-icon>
									</a>
									<a hlmTraceLine href="https://angular.dev/guide/signals" target="_blank" rel="noreferrer">
										<hlm-trace-icon>
											<ng-icon name="lucideGlobe" />
										</hlm-trace-icon>
										<hlm-trace-title>
											Angular signals | angular.dev
											<span class="sr-only">(opens in a new tab)</span>
										</hlm-trace-title>
										<hlm-trace-icon>
											<ng-icon name="lucideArrowUpRight" />
										</hlm-trace-icon>
									</a>
								</hlm-trace>
							</hlm-trace-collapsible-content>
						</hlm-trace-collapsible>
					</hlm-trace>
					<p>
						The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install
						fails. Run pnpm install locally and commit the lockfile.
					</p>
				</hlm-message-content>
			</hlm-message>
		</div>
	`,
})
export class TracePreview {
	protected readonly _diff = ` package.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)`;
}

export const defaultImports = `
import { HlmTraceImports } from '@spartan-ng/helm/trace';
`;

export const defaultSkeleton = `
<hlm-trace>
  <hlm-trace-line>
    <hlm-trace-icon>
      <ng-icon name="lucideSearch" />
    </hlm-trace-icon>
    <hlm-trace-title>Searched for minimumReleaseAge</hlm-trace-title>
  </hlm-trace-line>
</hlm-trace>
`;
