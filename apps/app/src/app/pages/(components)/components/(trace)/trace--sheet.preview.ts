import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideFolderSearch } from '@ng-icons/lucide';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTraceImports } from '@spartan-ng/helm/trace';

@Component({
	selector: 'spartan-trace-sheet',
	imports: [HlmTraceImports, HlmSheetImports, NgIcon],
	providers: [provideIcons({ lucideFolderSearch, lucideChevronRight, lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-trace class="max-w-sm">
			<hlm-sheet>
				<button hlmSheetTrigger side="right" hlmTraceLine>
					<hlm-trace-icon>
						<ng-icon name="lucideFolderSearch" />
					</hlm-trace-icon>
					<hlm-trace-title>Explored 4 files</hlm-trace-title>
					<hlm-trace-icon>
						<ng-icon name="lucideChevronRight" />
					</hlm-trace-icon>
				</button>

				<hlm-sheet-content *hlmSheetPortal="let ctx" class="sm:w-7xl">
					<hlm-sheet-header>
						<h3 hlmSheetTitle>Explored 4 files</h3>
						<p hlmSheetDescription>Files read while preparing the response.</p>
					</hlm-sheet-header>
					<ul class="flex flex-col gap-2 px-6 font-mono text-xs">
						<li>apps/v4/lib/docs.ts</li>
						<li>apps/v4/lib/components.ts</li>
						<li>apps/v4/angular.json</li>
						<li>apps/v4/package.json</li>
					</ul>
				</hlm-sheet-content>
			</hlm-sheet>
		</hlm-trace>
	`,
})
export class TraceSheet {}
