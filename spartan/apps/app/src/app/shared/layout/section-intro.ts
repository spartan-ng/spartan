import { Component, input } from '@angular/core';
import { PageOptionsDropdown } from '../page-options-dropdown/page-options-dropdown';

@Component({
	selector: 'spartan-section-intro',
	imports: [PageOptionsDropdown],
	host: {
		class: 'flex flex-col gap-4',
	},
	template: `
		<div class="flex items-center justify-between">
			<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ name() }}</h1>
			<spartan-page-options-dropdown class="ml-auto hidden md:block" />
		</div>
		<p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">{{ lead() }}</p>
	`,
})
export class SectionIntro {
	public readonly name = input('');
	public readonly lead = input('');
}
