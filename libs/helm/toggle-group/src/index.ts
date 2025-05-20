import { NgModule } from '@angular/core';
import { HlmToggleGroupDirective } from './lib/hlm-toggle-group.directive';
import { HlmToggleGroupItemDirective } from './lib/hlm-toggle-item.directive';

export * from './lib/hlm-toggle-group.directive';
export * from './lib/hlm-toggle-item.directive';

@NgModule({
	imports: [HlmToggleGroupItemDirective, HlmToggleGroupDirective],
	exports: [HlmToggleGroupItemDirective, HlmToggleGroupDirective],
})
export class HlmToggleGroupModule {}
