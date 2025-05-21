import { NgModule } from '@angular/core';

import { HlmAlertDialogActionButtonDirective } from './lib/hlm-alert-dialog-action-button.directive';
import { HlmAlertDialogCancelButtonDirective } from './lib/hlm-alert-dialog-cancel-button.directive';
import { HlmAlertDialogContentComponent } from './lib/hlm-alert-dialog-content.component';
import { HlmAlertDialogDescriptionDirective } from './lib/hlm-alert-dialog-description.directive';
import { HlmAlertDialogFooterComponent } from './lib/hlm-alert-dialog-footer.component';
import { HlmAlertDialogHeaderComponent } from './lib/hlm-alert-dialog-header.component';
import { HlmAlertDialogOverlayDirective } from './lib/hlm-alert-dialog-overlay.directive';
import { HlmAlertDialogTitleDirective } from './lib/hlm-alert-dialog-title.directive';
import { HlmAlertDialogComponent } from './lib/hlm-alert-dialog.component';

export * from './lib/hlm-alert-dialog-action-button.directive';
export * from './lib/hlm-alert-dialog-cancel-button.directive';
export * from './lib/hlm-alert-dialog-content.component';
export * from './lib/hlm-alert-dialog-description.directive';
export * from './lib/hlm-alert-dialog-footer.component';
export * from './lib/hlm-alert-dialog-header.component';
export * from './lib/hlm-alert-dialog-overlay.directive';
export * from './lib/hlm-alert-dialog-title.directive';
export * from './lib/hlm-alert-dialog.component';

export const HlmAlertDialogImports = [
	HlmAlertDialogContentComponent,
	HlmAlertDialogDescriptionDirective,
	HlmAlertDialogFooterComponent,
	HlmAlertDialogHeaderComponent,
	HlmAlertDialogOverlayDirective,
	HlmAlertDialogTitleDirective,
	HlmAlertDialogActionButtonDirective,
	HlmAlertDialogCancelButtonDirective,
	HlmAlertDialogComponent,
] as const;

@NgModule({
	imports: [...HlmAlertDialogImports],
	exports: [...HlmAlertDialogImports],
})
export class HlmAlertDialogModule {}
