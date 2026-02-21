import type { ConnectedPosition } from '@angular/cdk/overlay';

export type BrnTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export const BRN_TOOLTIP_POSITIONS_MAP: Record<BrnTooltipPosition, ConnectedPosition> = {
	top: {
		originX: 'center',
		originY: 'top',
		overlayX: 'center',
		overlayY: 'bottom',
		offsetY: -8,
	},
	bottom: {
		originX: 'center',
		originY: 'bottom',
		overlayX: 'center',
		overlayY: 'top',
		offsetY: 8,
	},
	left: {
		originX: 'start',
		originY: 'center',
		overlayX: 'end',
		overlayY: 'center',
		offsetX: -8,
	},
	right: {
		originX: 'end',
		originY: 'center',
		overlayX: 'start',
		overlayY: 'center',
		offsetX: 8,
	},
};
