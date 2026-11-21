import type { Direction } from '@angular/cdk/bidi';
import type { AutoFocusTarget, RestoreFocusValue } from '@angular/cdk/dialog';
import type {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import type { StaticProvider } from '@angular/core';

export type BrnDialogOptions = {
	ariaDescribedBy: string | null | undefined;
	ariaLabel: string | null | undefined;
	ariaLabelledBy: string | null | undefined;
	ariaModal: boolean;
	attachPositions: ConnectedPosition[];
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	autoFocus: boolean | AutoFocusTarget | (Record<never, never> & string);
	backdropClass: string | string[];
	direction?: Direction;
	closeOnOutsidePointerEvents: boolean;
	disableClose: boolean;
	/** Closes the dialog when focus moves outside of it. */
	closeOnFocusOut: boolean;
	hasBackdrop: boolean;
	/** Overlay pane size, forwarded to the CDK overlay config. */
	height?: string;
	id: string;
	maxHeight?: string;
	maxWidth?: string;
	panelClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	providers?: StaticProvider[] | (() => StaticProvider[]);
	restoreFocus: RestoreFocusValue;
	role: 'dialog' | 'alertdialog';
	scrollStrategy: ScrollStrategy | 'close' | 'reposition' | null | undefined;
	/** Whether Tab and Shift+Tab are kept inside the dialog. */
	trapFocus: boolean;
	width?: string;
};
