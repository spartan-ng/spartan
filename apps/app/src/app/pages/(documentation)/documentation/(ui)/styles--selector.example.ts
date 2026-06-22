import { Component, inject } from '@angular/core';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { STYLES } from '@spartan-ng/registry';

@Component({
	selector: 'spartan-styles-selector',
	imports: [HlmButtonImports],
	host: {
		class: 'flex flex-wrap items-center justify-center gap-2',
	},
	template: `
		@for (s of _styles; track s) {
			<button hlmBtn [variant]="_activeStyle() === s ? 'default' : 'outline'" (click)="setStyle(s)">
				{{ s }}
			</button>
		}
	`,
})
export class StylesSelector {
	private readonly _styleService = inject(StyleService);

	protected readonly _styles = STYLES;
	protected readonly _activeStyle = this._styleService.style;

	protected setStyle(style: (typeof STYLES)[number]): void {
		this._styleService.style.set(style);
	}
}
