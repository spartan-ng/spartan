import { NgModule } from '@angular/core';
import {
	BrnSelectContentComponent,
	BrnSelectScrollDownDirective,
	BrnSelectScrollUpDirective,
} from './lib/brn-select-content.component';
import { BrnSelectGroupDirective } from './lib/brn-select-group.directive';
import { BrnSelectLabelDirective } from './lib/brn-select-label.directive';
import { BrnSelectOptionDirective } from './lib/brn-select-option.directive';
import { BrnSelectPlaceholderDirective } from './lib/brn-select-placeholder.directive';
import { BrnSelectTriggerDirective } from './lib/brn-select-trigger.directive';
import { BrnSelectValueComponent } from './lib/brn-select-value.component';
import { BrnSelectValueDirective } from './lib/brn-select-value.directive';
import { BrnSelectComponent } from './lib/brn-select.component';
export * from './lib/brn-select-content.component';
export * from './lib/brn-select-group.directive';
export * from './lib/brn-select-label.directive';
export * from './lib/brn-select-option.directive';
export * from './lib/brn-select-placeholder.directive';
export * from './lib/brn-select-trigger.directive';
export * from './lib/brn-select-value.component';
export * from './lib/brn-select-value.directive';
export * from './lib/brn-select.component';

export const BrnSelectImports = [
	BrnSelectComponent,
	BrnSelectContentComponent,
	BrnSelectTriggerDirective,
	BrnSelectOptionDirective,
	BrnSelectValueComponent,
	BrnSelectScrollDownDirective,
	BrnSelectScrollUpDirective,
	BrnSelectGroupDirective,
	BrnSelectLabelDirective,
	BrnSelectValueDirective,
	BrnSelectPlaceholderDirective,
] as const;

@NgModule({
	imports: [...BrnSelectImports],
	exports: [...BrnSelectImports],
})
export class BrnSelectModule {}
