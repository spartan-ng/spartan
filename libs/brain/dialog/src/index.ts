import { NgModule } from '@angular/core';

import { BrnDialogCloseDirective } from './lib/brn-dialog-close.directive';
import { BrnDialogContentDirective } from './lib/brn-dialog-content.directive';
import { BrnDialogDescriptionDirective } from './lib/brn-dialog-description.directive';
import { BrnDialogOverlayComponent } from './lib/brn-dialog-overlay.component';
import { BrnDialogTitleDirective } from './lib/brn-dialog-title.directive';
import { BrnDialogTriggerDirective } from './lib/brn-dialog-trigger.directive';
import { BrnDialogComponent } from './lib/brn-dialog.component';

export * from './lib/brn-dialog-close.directive';
export * from './lib/brn-dialog-content.directive';
export * from './lib/brn-dialog-description.directive';
export * from './lib/brn-dialog-options';
export * from './lib/brn-dialog-overlay.component';
export * from './lib/brn-dialog-ref';
export * from './lib/brn-dialog-state';
export * from './lib/brn-dialog-title.directive';
export * from './lib/brn-dialog-token';
export * from './lib/brn-dialog-trigger.directive';
export * from './lib/brn-dialog-utils';
export * from './lib/brn-dialog.component';
export * from './lib/brn-dialog.service';

export const BrnDialogImports = [
	BrnDialogComponent,
	BrnDialogOverlayComponent,
	BrnDialogTriggerDirective,
	BrnDialogCloseDirective,
	BrnDialogContentDirective,
	BrnDialogTitleDirective,
	BrnDialogDescriptionDirective,
] as const;

@NgModule({
	imports: [...BrnDialogImports],
	exports: [...BrnDialogImports],
})
export class BrnDialogModule {}
