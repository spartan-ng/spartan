import { NgModule } from '@angular/core';

import { BrnTabsContentDirective } from './lib/brn-tabs-content.directive';
import { BrnTabsListDirective } from './lib/brn-tabs-list.directive';
import { BrnTabsTriggerDirective } from './lib/brn-tabs-trigger.directive';
import { BrnTabsDirective } from './lib/brn-tabs.directive';

export * from './lib/brn-tabs-content.directive';
export * from './lib/brn-tabs-list.directive';
export * from './lib/brn-tabs-paginated-list.directive';
export * from './lib/brn-tabs-trigger.directive';
export * from './lib/brn-tabs.directive';

export const BrnTabsImports = [
	BrnTabsDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
	BrnTabsContentDirective,
] as const;

@NgModule({
	imports: [...BrnTabsImports],
	exports: [...BrnTabsImports],
})
export class BrnTabsModule {}
