import { NgModule } from '@angular/core';
import { HlmToggleGroup } from './lib/hlm-toggle-group';
import { HlmToggleGroupItem } from './lib/hlm-toggle-item';

export * from './lib/hlm-toggle-group';
export * from './lib/hlm-toggle-item';

export const HlmToggleGroupImports = [HlmToggleGroup, HlmToggleGroupItem] as const;

@NgModule({
	imports: [...HlmToggleGroupImports],
	exports: [...HlmToggleGroupImports],
})
export class HlmToggleGroupModule {}
