import { ChangeDetectionStrategy, Component, HostListener, inject, Injectable, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { HlmButtonImports } from '@spartan-ng/helm/button';

/** Holds the source currently shown in the shared charts "View Code" drawer. */
@Injectable({ providedIn: 'root' })
export class ChartCodeDrawerService {
	readonly code = signal<string | null>(null);

	open(code: string): void {
		this.code.set(code);
	}

	close(): void {
		this.code.set(null);
	}
}

/**
 * A single shared slide-over rendered once in the charts layout. Card toolbars call
 * ChartCodeDrawerService.open() with the example source; this shows it with copy + syntax highlight.
 */
@Component({
	selector: 'charts-code-drawer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmButtonImports, NgIcon, Code],
	providers: [provideIcons({ lucideX })],
	template: `
		@if (svc.code(); as code) {
			<div class="animate-in fade-in fixed inset-0 z-50 bg-black/50 duration-200" (click)="svc.close()"></div>
			<aside
				class="bg-background animate-in slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l shadow-lg duration-300"
				role="dialog"
				aria-label="Component source"
			>
				<div class="flex items-start justify-between gap-4 border-b px-4 py-3">
					<div class="grid gap-1">
						<h3 class="text-sm font-semibold">Code</h3>
						<p class="text-muted-foreground text-sm">A standalone component you can copy into your app.</p>
					</div>
					<button hlmBtn variant="ghost" size="icon" class="-mt-1" (click)="svc.close()" aria-label="Close">
						<ng-icon name="lucideX" size="1rem" />
					</button>
				</div>
				<div
					class="flex min-h-0 flex-1 flex-col p-4 [&_.spartan-scroll]:flex [&_.spartan-scroll]:min-h-0 [&_.spartan-scroll]:flex-1 [&_.spartan-scroll]:flex-col [&_[class*=max-h-]]:!max-h-none"
				>
					<spartan-code class="min-h-0 flex-1" fileName="chart-demo.ts" [code]="code" />
				</div>
			</aside>
		}
	`,
})
export class ChartCodeDrawer {
	protected readonly svc = inject(ChartCodeDrawerService);

	@HostListener('document:keydown.escape')
	protected onEscape(): void {
		this.svc.close();
	}
}
