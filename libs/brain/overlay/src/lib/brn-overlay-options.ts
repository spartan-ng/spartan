import type { Direction } from '@angular/cdk/bidi';
import type { AutoFocusTarget } from '@angular/cdk/dialog';
import type {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import type { ElementRef, StaticProvider } from '@angular/core';

export type BrnOverlayOptions = {
	ariaDescribedBy: string | null | undefined;
	ariaLabel: string | null | undefined;
	ariaLabelledBy: string | null | undefined;
	ariaModal: boolean;
	attachPositions: ConnectedPosition[];
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	autoFocus: boolean | AutoFocusTarget | (Record<never, never> & string);
	backdropClass: string | string[];
	direction?: Direction;
	closeOnBackdropClick: boolean;
	closeOnOutsidePointerEvents: boolean;
	disableClose: boolean;
	hasBackdrop: boolean;
	id: string;
	panelClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	providers?: StaticProvider[] | (() => StaticProvider[]);
	restoreFocus: boolean | string | ElementRef;
	role: 'alertdialog' | 'dialog' | null;
	scrollStrategy: ScrollStrategy | 'close' | 'reposition' | null | undefined;
	trapFocus: boolean;
};
