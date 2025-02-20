import type { AutoFocusTarget } from '@angular/cdk/dialog';
import type {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import type { ElementRef, StaticProvider } from '@angular/core';

export type BrnDialogOptions = {
	id: string;
	role: 'dialog' | 'alertdialog';
	hasBackdrop: boolean;
	panelClass: string | string[];
	backdropClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	scrollStrategy: ScrollStrategy | null | undefined;
	restoreFocus: boolean | string | ElementRef;
	closeDelay: number;
	closeOnOutsidePointerEvents: boolean;
	closeOnBackdropClick: boolean;
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	attachPositions: ConnectedPosition[];
	autoFocus: AutoFocusTarget | (Record<never, never> & string);
	disableClose: boolean;
	ariaDescribedBy: string | null | undefined;
	ariaLabelledBy: string | null | undefined;
	ariaLabel: string | null | undefined;
	ariaModal: boolean;
	providers?: StaticProvider[] | (() => StaticProvider[]);
};

export const DEFAULT_BRN_DIALOG_OPTIONS: Readonly<Partial<BrnDialogOptions>> = {
	role: 'dialog',
	attachPositions: [],
	attachTo: null,
	autoFocus: 'first-tabbable',
	backdropClass: '',
	closeDelay: 100,
	closeOnBackdropClick: true,
	closeOnOutsidePointerEvents: false,
	hasBackdrop: true,
	panelClass: '',
	positionStrategy: null,
	restoreFocus: true,
	scrollStrategy: null,
	disableClose: false,
	ariaLabel: undefined,
	ariaModal: true,
};
