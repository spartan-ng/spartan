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
	backdropClass: string | string[];
	closeOnBackdropClick: boolean;
	closeOnOutsidePointerEvents: boolean;
	direction?: Direction;
	disableClose: boolean;
	hasBackdrop: boolean;
	id: string;
	panelClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	providers?: StaticProvider[] | (() => StaticProvider[]);
	role: string | null;
	scrollStrategy: ScrollStrategy | 'close' | 'reposition' | null | undefined;
};
