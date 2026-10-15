import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-collapsible',
	imports: [HlmTraceImports, NgIcon],
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
					<!-- TODO code block -->
					<div class="max-h-64">$ node --version v24.18.0</div>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</div>
	`,
})
export class TraceCollapsible {}
