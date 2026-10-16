import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-description',
	imports: [HlmTraceImports, NgIcon],
	providers: [provideIcons({ lucideFilePen, lucideTerminal, lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideFilePen" />
				</hlm-trace-icon>
				<hlm-trace-title>Edited components/settings/notification-preferences-form.tsx</hlm-trace-title>
				<hlm-trace-description class="font-mono">+48 -12</hlm-trace-description>
			</hlm-trace-line>
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideTerminal" />
				</hlm-trace-icon>
				<hlm-trace-title>Ran pnpm test</hlm-trace-title>
				<hlm-trace-description>14s</hlm-trace-description>
			</hlm-trace-line>
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideSearch" />
				</hlm-trace-icon>
				<hlm-trace-title>Searched for useChat</hlm-trace-title>
				<hlm-trace-description>8 results</hlm-trace-description>
			</hlm-trace-line>
		</hlm-trace>
	`,
})
export class TraceDescription {}
