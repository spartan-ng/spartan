import { Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClipboard } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Color as ColorType } from './colors';
import { ColorFormat } from './format-color';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[spartanColor]',
	imports: [NgIcon, HlmIconImports],
	providers: [
		provideIcons({
			lucideCheck,
			lucideClipboard,
		}),
	],
	host: {
		class:
			'group relative flex aspect-[3/1] w-full flex-1 cursor-pointer flex-col gap-2 text-(--text) sm:aspect-[2/3] sm:h-auto sm:w-auto [&>ng-icon]:absolute [&>ng-icon]:top-4 [&>ng-icon]:right-4 [&>ng-icon]:z-10 [&>ng-icon]:opacity-0 [&>ng-icon]:transition-opacity',
		'[style.--bg]': 'color().oklch',
		'[style.--text]': 'color().foreground',
		'(click)': 'onClick()',
	},
	template: `
		@let col = color();

		@if (this._isCopied()) {
			<ng-icon hlm name="lucideCheck" class="icon group-hover:opacity-100" size="sm" />
		} @else {
			<ng-icon hlm name="lucideClipboard" class="icon group-hover:opacity-100" size="sm" />
		}

		<div
			class="color-box border-ghost after:border-input w-full flex-1 rounded-md bg-[var(--bg)] after:rounded-lg md:rounded-lg"
		></div>

		<div class="flex w-full flex-col items-center justify-center gap-1">
			<span
				class="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary font-mono text-xs tabular-nums transition-colors sm:hidden xl:flex"
			>
				{{ col.class }}
			</span>
			<span
				class="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary hidden font-mono text-xs tabular-nums transition-colors sm:flex xl:hidden"
			>
				{{ col.scale }}
			</span>
		</div>
	`,
})
export class Color {
	public readonly color = input.required<ColorType>();
	public readonly colorFormat = input.required<ColorFormat>();
	protected readonly _isCopied = signal(false);

	onClick() {
		if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
			return;
		}
		void navigator.clipboard.writeText(this.color()[this.colorFormat()]);

		this._isCopied.set(true);

		setTimeout(() => {
			this._isCopied.set(false);
		}, 1000);
	}
}
