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
			class="bg-muted/40 h-10 w-10 -rotate-90 rounded-full p-1 [&>svg]:opacity-10 [&>svg]:grayscale dark:[&>svg]:opacity-50"
		/>
		<div class="h-6"></div>
	`,
})
export class ThreeHundredItemPlaceholder {}
