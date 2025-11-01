import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { SpartanLogo } from '@spartan-ng/app/app/shared/spartan-logo';

@Component({
	selector: 'spartan-th-item',
	imports: [NgOptimizedImage, SpartanLogo],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<a
			[class.opacity-40]="!imageLoaded()"
			[class.opacity-100]="imageLoaded()"
			[class.scale-95]="!imageLoaded()"
			[class.scale-100]="imageLoaded()"
			[class.backdrop-blur-sm]="!imageLoaded()"
			class="flex flex-col items-center transition-all duration-400"
			[href]="href()"
			target="_blank"
		>
			<div class="relative rounded-full">
				<img
					(load)="imageLoaded.set(true)"
					loading="lazy"
					[ngSrc]="src()"
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
	protected readonly href = computed(() => `https://github.com/${this.contributor()}`);
	protected readonly src = computed(() => `${this.href()}.png?size=80`);
	protected readonly imageLoaded = signal(false);
}
