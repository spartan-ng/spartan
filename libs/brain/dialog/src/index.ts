import { BrnDialog } from './lib/brn-dialog';
import { BrnDialogClose } from './lib/brn-dialog-close';
import { BrnDialogContent } from './lib/brn-dialog-content';
import { BrnDialogDescription } from './lib/brn-dialog-description';
import { BrnDialogOverlay } from './lib/brn-dialog-overlay';
import { BrnDialogTitle } from './lib/brn-dialog-title';
import { BrnDialogTrigger } from './lib/brn-dialog-trigger';

export * from './lib/brn-dialog';
export * from './lib/brn-dialog-close';
export * from './lib/brn-dialog-content';
export * from './lib/brn-dialog-description';
export * from './lib/brn-dialog-options';
export * from './lib/brn-dialog-overlay';
export * from './lib/brn-dialog-ref';
export * from './lib/brn-dialog-state';
export * from './lib/brn-dialog-title';
export * from './lib/brn-dialog-token';
export * from './lib/brn-dialog-trigger';
export * from './lib/brn-dialog-utils';
export * from './lib/brn-dialog.service';

export const BrnDialogImports = [
	BrnDialog,
	BrnDialogOverlay,
	BrnDialogTrigger,
	BrnDialogClose,
	BrnDialogContent,
	BrnDialogTitle,
	BrnDialogDescription,
] as const;
