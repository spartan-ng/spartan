import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-collapsible',
	imports: [HlmTraceImports, HlmCodeBlockImports, NgIcon],
	providers: [provideIcons({ lucideTerminal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-sm">
			<hlm-trace-collapsible>
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
						<pre hlmCodeBlockContent wrap [code]="_output" class="max-h-64"></pre>
					</hlm-code-block>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</div>
	`,
})
export class TraceCollapsible {
	protected readonly _output = `$ node --version
v24.18.0`;
}
