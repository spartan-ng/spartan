import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

@Component({
	selector: 'spartan-th-item',
	imports: [NgOptimizedImage],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<a
			[class.opacity-40]="!_imageLoaded()"
			[class.opacity-100]="_imageLoaded()"
			[class.scale-95]="!_imageLoaded()"
			[class.scale-100]="_imageLoaded()"
			[class.backdrop-blur-sm]="!_imageLoaded()"
			class="flex flex-col items-center transition-all duration-400"
			[href]="_href()"
			target="_blank"
		>
			<div class="relative rounded-full">
				<img
					(load)="_imageLoaded.set(true)"
					loading="lazy"
					[ngSrc]="_src()"
					width="40"
					height="40"
					[alt]="contributor()"
					class="rounded-full border"
				/>
			</div>
			<span
				class="mt-1 inline-block max-w-20 overflow-hidden text-[.7rem] font-medium text-ellipsis whitespace-nowrap hover:underline"
			>
				{{ contributor() }}
			</span>
		</a>
	`,
})
export class ThreeHundredItem {
	public readonly contributor = input.required<string>();
	protected readonly _href = computed(() => `https://github.com/${this.contributor()}`);
	protected readonly _src = computed(() => `${this._href()}.png?size=80`);
	protected readonly _imageLoaded = signal(false);
}
