import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-open-status',
	imports: [HlmTraceImports, HlmCodeBlockImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideTerminal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full max-w-sm flex-col items-start gap-4">
			<hlm-trace-collapsible [expanded]="true">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line>
						<hlm-trace-icon>
							<ng-icon name="lucideTerminal" />
						</hlm-trace-icon>
						<hlm-trace-title>Ran node --version</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-code-block size="sm">
						<pre hlmCodeBlockContent wrap [code]="_nodeOutput" class="max-h-64"></pre>
					</hlm-code-block>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
			<hlm-trace-collapsible [(expanded)]="_open">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line>
						<hlm-trace-icon>
							<ng-icon name="lucideTerminal" />
						</hlm-trace-icon>
						<hlm-trace-title>Ran pnpm --version</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-code-block size="sm">
						<pre hlmCodeBlockContent wrap [code]="_pnpmOutput" class="max-h-64"></pre>
					</hlm-code-block>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
			<button hlmBtn variant="outline" size="sm" (click)="_open.set(!_open())">
				{{ _open() ? 'Hide' : 'Show' }} the pnpm output
			</button>
		</div>
	`,
})
export class TraceOpenStatus {
	protected readonly _open = signal(false);

	protected readonly _nodeOutput = `$ node --version
v24.18.0`;

	protected readonly _pnpmOutput = `$ pnpm --version
10.33.4`;
}
