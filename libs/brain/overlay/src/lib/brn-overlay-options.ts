import type { Direction } from '@angular/cdk/bidi';
import type {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import type { StaticProvider } from '@angular/core';

export type BrnOverlayOptions = {
	attachPositions: ConnectedPosition[];
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	ariaModal: boolean;
	/** Move focus to the first tabbable element inside the overlay when it opens. */
	autoFocus: boolean;
	backdropClass: string | string[];
	closeOnOutsidePointerEvents: boolean;
	direction?: Direction;
	disableClose: boolean;
	hasBackdrop: boolean;
	id: string;
	panelClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	providers?: StaticProvider[] | (() => StaticProvider[]);
	/**
	 * Move focus back to the element that was focused when the overlay opened, if focus is lost
	 * (`body`, null or disconnected) when the overlay closes.
	 */
	restoreFocus: boolean;
	role: string | null;
	scrollStrategy: ScrollStrategy | 'close' | 'reposition' | null | undefined;
};
