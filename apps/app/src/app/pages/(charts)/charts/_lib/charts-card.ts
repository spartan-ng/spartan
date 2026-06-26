import { ChangeDetectionStrategy, Component, contentChild, Directive, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { ChartCodeDrawerService } from './chart-code-drawer';

/** Marks the projected footer of a `<charts-card>` so the card only renders the footer area when present. */
@Directive({ selector: '[chartsCardFooter]' })
export class ChartsCardFooter {}

/**
 * Reusable shadcn-style chart card: header (title/description), the chart (default slot), an optional
 * footer slot, and a top-right toolbar (Copy + View Code) that opens the shared code drawer. Built
 * entirely with Tailwind utilities so individual examples stay tiny.
 */
@Component({
	selector: 'charts-card',
	// `title` is a reserved global attribute, so the static `title="..."` used to bind the input also
	// lands on the host and triggers the browser's native tooltip on hover - strip it from the DOM.
	host: { '[attr.title]': 'null' },
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmButtonImports, HlmTooltipImports, HlmSeparator, NgIcon],
	providers: [provideIcons({ lucideCopy, lucideCheck })],
	template: `
		<div class="bg-card text-card-foreground relative flex flex-col gap-6 rounded-xl border py-6">
			<div class="absolute -top-10 right-0 z-10 flex items-center gap-1">
				<button
					hlmBtn
					variant="ghost"
					size="icon"
					type="button"
					class="size-8"
					[hlmTooltip]="_copied() ? 'Copied' : 'Copy code'"
					aria-label="Copy code"
					(click)="copy()"
				>
					<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" size="1rem" />
				</button>
				<hlm-separator orientation="vertical" class="!h-4 !self-center" />
				<button hlmBtn variant="outline" size="sm" type="button" (click)="_drawer.open(code())">View Code</button>
			</div>

			<div class="flex flex-col gap-1.5 px-6">
				<h3 class="text-base leading-none font-semibold">{{ title() }}</h3>
				@if (description()) {
					<p class="text-muted-foreground text-sm">{{ description() }}</p>
				}
			</div>

			<div class="px-6">
				<ng-content />
			</div>

			@if (_footer()) {
				<div class="text-muted-foreground flex flex-col gap-1.5 px-6 text-sm">
					<ng-content select="[chartsCardFooter]" />
				</div>
			}
		</div>
	`,
})
export class ChartsCard {
	readonly title = input<string>('');
	readonly description = input<string>('');
	readonly code = input<string>('');

	protected readonly _drawer = inject(ChartCodeDrawerService);
	protected readonly _footer = contentChild(ChartsCardFooter);
	protected readonly _copied = signal(false);

	copy(): void {
		void navigator.clipboard?.writeText(this.code());
		this._copied.set(true);
		setTimeout(() => this._copied.set(false), 1500);
	}
}

export const ChartsCardImports = [ChartsCard, ChartsCardFooter] as const;
