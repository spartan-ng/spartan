import { NgModule } from '@angular/core';
import { BrnSeparator } from './lib/brn-separator';

export * from './lib/brn-separator';

export const BrnSeparatorImports = [BrnSeparator] as const;

@NgModule({
	imports: [...BrnSeparatorImports],
	exports: [...BrnSeparatorImports],
})
export class BrnSeparatorModule {}
