import type { AutoFocusTarget } from '@angular/cdk/dialog';
import type {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import type { ElementRef, StaticProvider } from '@angular/core';

export type BrnDialogOptions = {
	ariaDescribedBy: string | null | undefined;
	ariaLabel: string | null | undefined;
	ariaLabelledBy: string | null | undefined;
	ariaModal: boolean;
	attachPositions: ConnectedPosition[];
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	autoFocus: AutoFocusTarget | (Record<never, never> & string);
	backdropClass: string | string[];
	closeDelay: number;
	closeOnBackdropClick: boolean;
	closeOnOutsidePointerEvents: boolean;
	disableClose: boolean;
	hasBackdrop: boolean;
	id: string;
	panelClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	providers?: StaticProvider[] | (() => StaticProvider[]);
	restoreFocus: boolean | string | ElementRef;
	role: 'dialog' | 'alertdialog';
	scrollStrategy: ScrollStrategy | 'close' | 'reposition' | null | undefined;
};
