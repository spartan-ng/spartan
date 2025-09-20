import { NgModule } from '@angular/core';
import { BrnLabel } from './lib/brn-label';

export * from './lib/brn-label';

export const BrnLabelImports = [BrnLabel] as const;

@NgModule({
	imports: [...BrnLabelImports],
	exports: [...BrnLabelImports],
})
export class BrnLabelModule {}
