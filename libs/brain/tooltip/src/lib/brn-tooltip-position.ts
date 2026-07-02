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

/** Fallback order for each preferred position when it doesn't fit in the viewport. */
export const BRN_TOOLTIP_FALLBACK_POSITIONS: Record<BrnTooltipPosition, BrnTooltipPosition[]> = {
	top: ['bottom', 'right', 'left'],
	bottom: ['top', 'right', 'left'],
	left: ['right', 'top', 'bottom'],
	right: ['left', 'top', 'bottom'],
};

/** The fields we read off a `DOMRect`; broken out so the arrow math is unit-testable without the DOM. */
export type TooltipRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

/** Arrow is 10px across (see the arrow classes in helm's tooltip). */
const ARROW_SIZE = 10;
/** Keep the arrow this far clear of the tooltip's rounded corners. */
const ARROW_EDGE_GAP = 4;

/**
 * How far to slide the arrow from the tooltip's center toward the trigger's center, so it keeps
 * pointing at the trigger after CDK pushes an edge-anchored tooltip back into the viewport (#1247).
 * Top/bottom tooltips track on X, left/right on Y. Clamped so the arrow stays within the tooltip.
 */
export function getTooltipArrowOffset(
	triggerRect: TooltipRect,
	tooltipRect: TooltipRect,
	position: BrnTooltipPosition,
): { x: number; y: number } {
	if (position === 'top' || position === 'bottom') {
		const delta = triggerRect.left + triggerRect.width / 2 - (tooltipRect.left + tooltipRect.width / 2);
		return { x: clampArrowOffset(delta, tooltipRect.width), y: 0 };
	}
	const delta = triggerRect.top + triggerRect.height / 2 - (tooltipRect.top + tooltipRect.height / 2);
	return { x: 0, y: clampArrowOffset(delta, tooltipRect.height) };
}

function clampArrowOffset(offset: number, tooltipExtent: number): number {
	const max = Math.max(0, tooltipExtent / 2 - ARROW_SIZE / 2 - ARROW_EDGE_GAP);
	return Math.min(Math.max(offset, -max), max);
}

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
