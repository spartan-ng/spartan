import type { ConnectedPosition } from '@angular/cdk/overlay';

export type BrnTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export const BRN_TOOLTIP_POSITIONS_MAP: Record<BrnTooltipPosition, ConnectedPosition> = {
	top: {
		originX: 'center',
		originY: 'top',
		overlayX: 'center',
		overlayY: 'bottom',
	},
	bottom: {
		originX: 'center',
		originY: 'bottom',
		overlayX: 'center',
		overlayY: 'top',
	},
	left: {
		originX: 'start',
		originY: 'center',
		overlayX: 'end',
		overlayY: 'center',
	},
	right: {
		originX: 'end',
		originY: 'center',
		overlayX: 'start',
		overlayY: 'center',
	},
};

export function getTooltipSideOffset(position: BrnTooltipPosition, sideOffset: number): { x: number; y: number } {
	switch (position) {
		case 'top':
			return { x: 0, y: -sideOffset };
		case 'bottom':
			return { x: 0, y: sideOffset };
		case 'left':
			return { x: -sideOffset, y: 0 };
		case 'right':
			return { x: sideOffset, y: 0 };
	}
}

/** Fallback order for each preferred position when it doesn't fit in the viewport. */
export const BRN_TOOLTIP_FALLBACK_POSITIONS: Record<BrnTooltipPosition, BrnTooltipPosition[]> = {
	top: ['bottom', 'right', 'left'],
	bottom: ['top', 'right', 'left'],
	left: ['right', 'top', 'bottom'],
	right: ['left', 'top', 'bottom'],
};

/** Map a resolved CDK ConnectedPosition back to a BrnTooltipPosition, or null if no match. */
export function resolveTooltipPosition(pair: ConnectedPosition): BrnTooltipPosition | null {
	for (const [pos, config] of Object.entries(BRN_TOOLTIP_POSITIONS_MAP)) {
		if (
			pair.originX === config.originX &&
			pair.originY === config.originY &&
			pair.overlayX === config.overlayX &&
			pair.overlayY === config.overlayY
		) {
			return pos as BrnTooltipPosition;
		}
	}
	return null;
}
