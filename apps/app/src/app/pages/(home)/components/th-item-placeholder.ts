import { Component } from '@angular/core';
import { SpartanLogo } from '@spartan-ng/app/app/shared/spartan-logo';

@Component({
	selector: 'spartan-th-item-placeholder',
	imports: [SpartanLogo],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<spartan-logo
			flat
			class="bg-muted/40 logo-legacy:[&>svg]:translate-y-0 h-10 w-10 rounded-full p-1.5 [&>svg]:translate-y-[1px] [&>svg]:opacity-10 [&>svg]:grayscale dark:[&>svg]:opacity-50"
		/>
		<div class="h-6"></div>
	`,
})
export class ThreeHundredItemPlaceholder {}
