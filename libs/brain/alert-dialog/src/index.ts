import { BrnAlertDialog } from './lib/brn-alert-dialog';
import { BrnAlertDialogContent } from './lib/brn-alert-dialog-content';
import { BrnAlertDialogDescription } from './lib/brn-alert-dialog-description';
import { BrnAlertDialogOverlay } from './lib/brn-alert-dialog-overlay';
import { BrnAlertDialogTitle } from './lib/brn-alert-dialog-title';
import { BrnAlertDialogTrigger } from './lib/brn-alert-dialog-trigger';

export * from './lib/brn-alert-dialog';
export * from './lib/brn-alert-dialog-content';
export * from './lib/brn-alert-dialog-description';
export * from './lib/brn-alert-dialog-overlay';
export * from './lib/brn-alert-dialog-title';
export * from './lib/brn-alert-dialog-trigger';

export const BrnAlertDialogImports = [
	BrnAlertDialog,
	BrnAlertDialogOverlay,
	BrnAlertDialogTrigger,
	BrnAlertDialogContent,
	BrnAlertDialogTitle,
	BrnAlertDialogDescription,
] as const;
