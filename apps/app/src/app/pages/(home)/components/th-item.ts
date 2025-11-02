import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'spartan-th-item',
	imports: [NgOptimizedImage],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<a class="flex flex-col items-center" [href]="_href()" target="_blank">
			<img loading="lazy" [ngSrc]="_src()" width="40" height="40" [alt]="contributor()" class="rounded-full" />
			<span class="mt-1 inline-block text-[.7rem] font-medium whitespace-nowrap hover:underline">
				{{ contributor() }}
			</span>
		</a>
	`,
})
export class ThreeHundredItem {
	public readonly contributor = input.required<string>();
	protected readonly _href = computed(() => `https://github.com/${this.contributor()}`);
	protected readonly _src = computed(() => `${this._href()}.png?size=80`);
}
