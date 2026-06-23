import type { ConnectedPosition } from '@angular/cdk/overlay';

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuSide = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITE_SIDE: Record<string, MenuSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

// derive data-side from the transform-origin CDK sets on the content. the anchored corner faces the
// trigger, so the side is its opposite (root reads the vertical axis, submenu the horizontal). CDK's
// origin is rtl-aware, so the derived side is too.
export const deriveMenuSideFromTransformOrigin = (transformOrigin: string, isRoot: boolean): MenuSide => {
	const [x, y] = transformOrigin.trim().split(/\s+/);
	return OPPOSITE_SIDE[isRoot ? y : x] ?? (isRoot ? 'bottom' : 'right');
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
