import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-line',
	imports: [HlmTraceImports, NgIcon],
	providers: [provideIcons({ lucideGitBranch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-line>
				<hlm-trace-icon>
					<ng-icon name="lucideGitBranch" />
				</hlm-trace-icon>
				<hlm-trace-title>Created branch fix/frozen-lockfile</hlm-trace-title>
			</hlm-trace-line>
		</hlm-trace>
	`,
})
export class TraceLine {}
