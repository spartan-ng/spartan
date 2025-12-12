import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export const hlmCode = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';

@Directive({
	selector: '[hlmCode]',
})
export class HlmCode {
	constructor() {
		classes(() => hlmCode);
	}
}
