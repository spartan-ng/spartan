import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal } from '@ng-icons/lucide';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-commit',
	imports: [HlmTraceImports, HlmSheetImports, NgIcon],
	providers: [provideIcons({ lucideGitCommitHorizontal, lucideFilePen, lucideFilePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-trace-collapsible [expanded]="true">
				<button hlmTraceCollapsibleTrigger>
					<hlm-trace-line>
						<hlm-trace-icon>
							<ng-icon name="lucideGitCommitHorizontal" />
						</hlm-trace-icon>
						<hlm-trace-title>Committed a1b2c3: Fix the login redirect</hlm-trace-title>
					</hlm-trace-line>
				</button>
				<hlm-trace-collapsible-content>
					<hlm-trace>
						@for (file of _files; track file.path) {
							<hlm-sheet>
								<button hlmSheetTrigger side="right" hlmTraceLine>
									<hlm-trace-icon>
										<ng-icon [name]="file.icon" />
									</hlm-trace-icon>
									<hlm-trace-title>{{ file.label }} {{ file.path }}</hlm-trace-title>
									<hlm-trace-description class="font-mono">{{ file.stat }}</hlm-trace-description>
								</button>
								<hlm-sheet-content *hlmSheetPortal="let ctx" class="sm:w-7xl">
									<hlm-sheet-header>
										<h3 hlmSheetTitle>{{ file.path }}</h3>
										<p hlmSheetDescription>{{ file.label }} · {{ file.stat }}</p>
									</hlm-sheet-header>
									<pre
										class="bg-muted text-foreground mx-6 overflow-x-auto rounded-md p-3 font-mono text-xs"
									><code>{{ file.diff }}</code></pre>
								</hlm-sheet-content>
							</hlm-sheet>
						}
					</hlm-trace>
				</hlm-trace-collapsible-content>
			</hlm-trace-collapsible>
		</hlm-trace>
	`,
})
export class TraceCommit {
	protected readonly _files = [
		{
			icon: 'lucideFilePen',
			label: 'Edited',
			path: 'app/login/page.tsx',
			stat: '+2 -2',
			diff: `- redirect('/dashboard')
+ redirect('/projects')`,
		},
		{
			icon: 'lucideFilePlus',
			label: 'Added',
			path: 'lib/auth/redirect.ts',
			stat: '+7 -0',
			diff: `+ export function redirect(to: string) {
+   return { to };
+ }`,
		},
	];
}
