import { NgModule } from '@angular/core';
import { BrnToggleGroup } from './lib/brn-toggle-group';
import { BrnToggleGroupItem } from './lib/brn-toggle-item';

export * from './lib/brn-toggle-group';
export * from './lib/brn-toggle-item';

@NgModule({
	imports: [BrnToggleGroupItem, BrnToggleGroup],
	exports: [BrnToggleGroupItem, BrnToggleGroup],
})
export class BrnToggleGroupModule {}

@NgModule({
	imports: [BrnToggleGroupItem],
	exports: [BrnToggleGroupItem],
})
export class BrnToggleGroupItemModule {}
