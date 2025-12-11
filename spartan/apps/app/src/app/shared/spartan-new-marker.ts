import { Directive } from '@angular/core';

@Directive({
	selector: 'span[spartanNewMarker]',
	host: {
		class: 'flex size-2 rounded-full bg-[#c3012d]',
	},
})
export class SpartanNewMarker {}
