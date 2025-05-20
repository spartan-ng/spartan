import { NgModule } from '@angular/core';

import { HlmSheetCloseDirective } from './lib/hlm-sheet-close.directive';
import { HlmSheetContentComponent } from './lib/hlm-sheet-content.component';
import { HlmSheetDescriptionDirective } from './lib/hlm-sheet-description.directive';
import { HlmSheetFooterComponent } from './lib/hlm-sheet-footer.component';
import { HlmSheetHeaderComponent } from './lib/hlm-sheet-header.component';
import { HlmSheetOverlayDirective } from './lib/hlm-sheet-overlay.directive';
import { HlmSheetTitleDirective } from './lib/hlm-sheet-title.directive';
import { HlmSheetComponent } from './lib/hlm-sheet.component';

export * from './lib/hlm-sheet-close.directive';
export * from './lib/hlm-sheet-content.component';
export * from './lib/hlm-sheet-description.directive';
export * from './lib/hlm-sheet-footer.component';
export * from './lib/hlm-sheet-header.component';
export * from './lib/hlm-sheet-overlay.directive';
export * from './lib/hlm-sheet-title.directive';
export * from './lib/hlm-sheet.component';

export const HlmSheetImports = [
	HlmSheetComponent,
	HlmSheetCloseDirective,
	HlmSheetContentComponent,
	HlmSheetDescriptionDirective,
	HlmSheetFooterComponent,
	HlmSheetHeaderComponent,
	HlmSheetOverlayDirective,
	HlmSheetTitleDirective,
] as const;

@NgModule({
	imports: [...HlmSheetImports],
	exports: [...HlmSheetImports],
})
export class HlmSheetModule {}
