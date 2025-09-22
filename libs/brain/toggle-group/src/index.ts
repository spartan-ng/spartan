import { NgModule } from '@angular/core';
import { BrnToggleGroup } from './lib/brn-toggle-group';
import { BrnToggleGroupItem } from './lib/brn-toggle-item';

export * from './lib/brn-toggle-group';
export * from './lib/brn-toggle-item';

export const BrnToggleGroupImports = [BrnToggleGroup, BrnToggleGroupItem] as const;

@NgModule({
	imports: [...BrnToggleGroupImports],
	exports: [...BrnToggleGroupImports],
})
export class BrnToggleGroupModule {}

@NgModule({
	imports: [BrnToggleGroupItem],
	exports: [BrnToggleGroupItem],
})
export class BrnToggleGroupItemModule {}
