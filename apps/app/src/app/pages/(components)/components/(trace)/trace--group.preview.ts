import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideSearch, lucideTerminal } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-group',
	imports: [HlmTraceImports, NgIcon],
	providers: [provideIcons({ lucideSearch, lucideFileText, lucideTerminal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideSearch" />
				</hlm-trace-icon>
				<hlm-trace-title>Searched for minimumReleaseAge</hlm-trace-title>
			</hlm-trace-line>
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideFileText" />
				</hlm-trace-icon>
				<hlm-trace-title>Read pnpm-workspace.yaml</hlm-trace-title>
			</hlm-trace-line>
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideTerminal" />
				</hlm-trace-icon>
				<hlm-trace-title>Ran pnpm install</hlm-trace-title>
			</hlm-trace-line>
		</hlm-trace>
	`,
})
export class TraceGroup {}
