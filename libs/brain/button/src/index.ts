import { NgModule } from '@angular/core';
import { BrnButton } from './lib/brn-button';

export * from './lib/brn-button';

export const BrnButtonImports = [BrnButton] as const;

@NgModule({
	imports: [...BrnButtonImports],
	exports: [...BrnButtonImports],
})
export class BrnButtonModule {}
