import { NgModule } from '@angular/core';
import { HlmToggleGroup } from './lib/hlm-toggle-group';
import { HlmToggleGroupItem } from './lib/hlm-toggle-item';

export * from './lib/hlm-toggle-group';
export * from './lib/hlm-toggle-item';

@NgModule({
	imports: [HlmToggleGroupItem, HlmToggleGroup],
	exports: [HlmToggleGroupItem, HlmToggleGroup],
})
export class HlmToggleGroupModule {}
