import { Component, Input } from '@angular/core';

@Component({
	selector: 'spartan-section-intro',
	host: {
		class: 'flex flex-col gap-2',
	},
	template: `
		<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ name }}</h1>
		<p class="text-muted-foreground text-balance text-[1.05rem] sm:text-base">{{ lead }}</p>
	`,
})
export class SectionIntroComponent {
	@Input()
	public name = '';
	@Input()
	public lead = '';
}
