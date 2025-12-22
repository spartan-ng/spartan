import { Directive } from '@angular/core';
import { BrnResizablePanel } from '@spartan-ng/brain/resizable';

@Directive({
	selector: '[hlmResizablePanel],hlm-resizable-panel',
	hostDirectives: [
		{
			directive: BrnResizablePanel,
			inputs: ['defaultSize', 'id', 'collapsible', 'maxSize', 'minSize'],
		},
	],
	host: {
		'data-slot': 'resizable-panel',
	},
})
export class HlmResizablePanel {}
