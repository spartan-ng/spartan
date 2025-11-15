import type { ConnectedPosition } from '@angular/cdk/overlay';

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuSide = 'top' | 'bottom' | 'left' | 'right';

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
