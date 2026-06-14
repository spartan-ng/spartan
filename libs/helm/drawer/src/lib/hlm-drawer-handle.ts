import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmDrawerHandle]',
	host: { 'data-slot': 'drawer-handle' },
})
export class HlmDrawerHandle {}
