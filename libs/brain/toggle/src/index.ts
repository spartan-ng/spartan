import { NgModule } from '@angular/core';
import { BrnToggle } from './lib/brn-toggle';

export * from './lib/brn-toggle';

export const BrnToggleImports = [BrnToggle] as const;

@NgModule({
	imports: [...BrnToggleImports],
	exports: [...BrnToggleImports],
})
export class BrnToggleModule {}
