import { Component, Input } from '@angular/core';
import { PageOptionsDropdownComponent } from '../page-options-dropdown/page-options-dropdown';

@Component({
	selector: 'spartan-section-intro',
	host: {
		class: 'flex flex-col gap-2 mb-5',
	},
	imports: [PageOptionsDropdownComponent],
	template: `
		<div class="flex items-center justify-between">
			<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ name }}</h1>
			<spartan-page-options-dropdown class="ml-auto hidden md:block" />
		</div>
		<p class="text-muted-foreground text-balance text-[1.05rem] sm:text-base">{{ lead }}</p>
	`,
})
export class SectionIntroComponent {
	@Input()
	public name = '';
	@Input()
	public lead = '';
}
