import type { ConnectedPosition } from '@angular/cdk/overlay';

export type BrnOverlaySide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Derive which side of the trigger the overlay was actually placed on from the
 * CDK-resolved connected position. Used to drive the directional enter animation
 * (the content slides in from the trigger's edge), matching the
 * `data-[side=*]:slide-in-from-*` behaviour of the reference design system.
 */
export function resolveConnectedSide(pair: ConnectedPosition): BrnOverlaySide {
	// Vertical placement: the overlay sits below the origin (origin bottom / overlay top)
	// or above it (origin top / overlay bottom).
	if (pair.overlayY === 'bottom' && pair.originY === 'top') return 'top';
	if (pair.overlayY === 'top' && pair.originY === 'bottom') return 'bottom';
	// Horizontal placement.
	if (pair.overlayX === 'end' && pair.originX === 'start') return 'left';
	if (pair.overlayX === 'start' && pair.originX === 'end') return 'right';
	// Centred / unknown pairings fall back to the default (below the trigger).
	return 'bottom';
}
