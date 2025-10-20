import type { ConnectedPosition } from '@angular/cdk/overlay';

export type BrnMenuAlign = 'start' | 'center' | 'end' | undefined;
export const getBrnMenuAlign = (align: Exclude<BrnMenuAlign, undefined>): ConnectedPosition[] => [
	{
		originX: align,
		originY: 'bottom',
		overlayX: align,
		overlayY: 'top',
	},
	{
		originX: align,
		originY: 'top',
		overlayX: align,
		overlayY: 'bottom',
	},
];
