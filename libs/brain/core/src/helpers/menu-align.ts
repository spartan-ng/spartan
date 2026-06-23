import type { ConnectedPosition } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuSide = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITE_SIDE: Record<string, MenuSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Lets a menu trigger expose its configured `side` to the portaled content. CDK gives the content a
 * child injector whose parent is the trigger's injector, so the content can resolve this token to
 * learn which axis to read off the transform-origin.
 */
export interface MenuSideProvider {
	readonly side: () => MenuSide;
}

export const MENU_SIDE = new InjectionToken<MenuSideProvider>('SpartanMenuSide');

// derive data-side from the transform-origin CDK sets on the content. the anchored corner faces the
// trigger, so the side is its opposite. the configured `side` tells us which axis carries the anchor
// (top/bottom -> vertical token, left/right -> horizontal), so a CDK flip is read off the right axis.
// CDK's origin is rtl-aware, so the derived side is too. falls back to the configured side when the
// transform-origin is missing or centered (no flip information to apply).
export const deriveMenuSideFromTransformOrigin = (transformOrigin: string, side: MenuSide): MenuSide => {
	const [x, y] = transformOrigin.trim().split(/\s+/);
	const anchor = side === 'top' || side === 'bottom' ? y : x;
	return OPPOSITE_SIDE[anchor] ?? side;
};

export const createMenuPosition = (align: MenuAlign, side: MenuSide): ConnectedPosition[] => {
	const verticalAlign = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';

	const createPositions = (
		originX: 'start' | 'center' | 'end',
		originY: 'top' | 'center' | 'bottom',
		overlayX: 'start' | 'center' | 'end',
		overlayY: 'top' | 'center' | 'bottom',
	): ConnectedPosition[] => [
		{ originX, originY, overlayX, overlayY },
		{ originX: overlayX, originY: overlayY, overlayX: originX, overlayY: originY },
	];

	switch (side) {
		case 'top':
			return createPositions(align, 'top', align, 'bottom');
		case 'bottom':
			return createPositions(align, 'bottom', align, 'top');
		case 'left':
			return createPositions('start', verticalAlign, 'end', verticalAlign);
		case 'right':
			return createPositions('end', verticalAlign, 'start', verticalAlign);
	}
};
