import type { ConnectionPositionPair } from '@angular/cdk/overlay';

export const getTransformOrigin = (position: ConnectionPositionPair): string => {
	const x = position.overlayX === 'start' ? 'left' : position.overlayX === 'end' ? 'right' : 'center';
	const y = position.overlayY === 'top' ? 'top' : position.overlayY === 'bottom' ? 'bottom' : 'center';
	return `${x} ${y}`;
};
