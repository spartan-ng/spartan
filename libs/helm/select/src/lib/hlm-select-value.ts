import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'hlm-select-value, [hlmSelectValue]',
})
export class HlmSelectValue {
	constructor() {
		classes(() => 'data-[placeholder]:text-muted-foreground line-clamp-1 flex items-center gap-2 truncate');
	}
}
