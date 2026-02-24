import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

/**
 * @deprecated Value display is now handled by the `<input brnSelectTrigger>` binding.
 * Use `[displayWith]` on `<hlm-select>` for custom label formatting.
 * This component will be removed in a future major version.
 */
@Directive({
	selector: 'hlm-select-value, [hlmSelectValue]',
})
export class HlmSelectValue {
	constructor() {
		classes(() => 'data-[placeholder]:text-muted-foreground line-clamp-1 flex items-center gap-2 truncate');
	}
}
