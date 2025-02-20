import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'spartan-th-item',
	imports: [NgOptimizedImage],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<a class="flex flex-col items-center" [href]="href()" target="_blank">
			<img loading="lazy" [ngSrc]="src()" width="40" height="40" [alt]="contributor()" class="rounded-full" />
			<span class="mt-1 inline-block whitespace-nowrap text-[.7rem] font-medium hover:underline">
				{{ contributor() }}
			</span>
		</a>
	`,
})
export class ThreeHundredItemComponent {
	public contributor = input.required<string>();
	public href = computed(() => `https://github.com/${this.contributor()}`);
	public src = computed(() => `${this.href()}.png?size=80`);
}
