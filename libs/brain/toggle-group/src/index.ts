import { NgModule } from '@angular/core';
import { BrnToggleGroupComponent } from './lib/brn-toggle-group.component';
import { BrnToggleGroupItemDirective } from './lib/brn-toggle-item.directive';

export * from './lib/brn-toggle-group.component';
export * from './lib/brn-toggle-item.directive';

@NgModule({
	imports: [BrnToggleGroupItemDirective, BrnToggleGroupComponent],
	exports: [BrnToggleGroupItemDirective, BrnToggleGroupComponent],
})
export class BrnToggleGroupModule {}

@NgModule({
	imports: [BrnToggleGroupItemDirective],
	exports: [BrnToggleGroupItemDirective],
})
export class BrnToggleGroupItemModule {}
